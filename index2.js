const getTerms = query =>
  query
    .split(/(\(|\)|\s+OR\s+|\s+AND\s+|\s+NOT\s+)/)
    .map(term => term.trim())
    .filter(term => !!term);

const getSubTerms = (terms = []) => {
  let subterms;
  if (terms.includes('(')) {
    subterms = [[]];
    let subtermIndex = 0;
    let skipIterationIdx;
    terms.forEach((term, i) => {
      if (i !== skipIterationIdx) {
        if (term === ')') {
          subtermIndex += 1;
          subterms[subtermIndex] = [];
          if (terms?.[i + 1]) {
            subterms[subtermIndex].push(terms?.[i + 1]);
            subtermIndex += 1;
            subterms[subtermIndex] = [];
            skipIterationIdx = i + 1;
          }
        }
        if (term === '(') {
          if (terms?.[i - 1] && terms?.[i - 2] !== ')') {
            subterms[subtermIndex].pop();
            subtermIndex += 1;
            subterms[subtermIndex] = [terms?.[i - 1]];
          }
          subtermIndex += 1;
          subterms[subtermIndex] = [];
        }
        if (term !== ')' && term !== '(') {
          subterms[subtermIndex].push(term);
        }
      } else {
        skipIterationIdx = undefined;
      }
    });
  }
  return subterms?.filter(el => el.length > 0);
};

const searchBySubterms = terms => {
  let result = [];
  // Перевіряємо кожен термін запиту
  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];

    if (term === 'AND' || term === 'OR' || term === 'NOT' || term === '(' || term === ')') {
      // Пропускаємо логічні оператори та дужки
      continue;
    } else if (term.startsWith('NOT ')) {
      // Обробляємо оператор НЕ (NOT)
      const notTerm = term.substring(4);
      const notResult = [];

      // Знаходимо документи, які не містять дане слово
      for (const doc in documents) {
        if (!documents.hasOwnProperty(doc)) {
          continue;
        }

        if (!documents[doc].includes(notTerm)) {
          notResult.push(doc);
        }
      }

      // Додаємо результат до списку результатів
      if (notResult.length > 0) {
        if (result.length === 0) {
          result = notResult;
        } else if (terms[i - 1] === 'OR') {
          result = [...new Set([...result, ...notResult])];
        } else if (terms[i - 1] === 'AND') {
          result = result.filter(doc => notResult.includes(doc));
        }
      }
    } else {
      const termResult = [];

      for (const doc in documents) {
        if (!documents.hasOwnProperty(doc)) {
          continue;
        }

        if (documents[doc].includes(term)) {
          termResult.push(doc);
        }
      }
      // Додаємо результат до списку результатів
      if (termResult.length > 0) {
        if (result.length === 0) {
          result = termResult;
        } else if (terms[i - 1] === 'OR') {
          result = [...new Set([...result, ...termResult])];
        } else if (terms[i - 1] === 'AND') {
          result = result.filter(doc => termResult.includes(doc));
        }
      }
    }
  }
  return result;
};

function booleanModel(query, documents) {
  const terms = getTerms(query);
  const subterms = getSubTerms(terms);
  console.log('su', subterms);

  if (subterms?.length > 0) {
    return subterms.map((sterms, i) => {
      console.log(sterms);
      if (i % 2 !== 0) {
        return searchBySubterms(sterms);
      }
      return sterms[0];
    });
  }

  return searchBySubterms(terms);
}

// Задаємо документи та їхні індексні терміни
const documents = {
  1: ['apple', 'orange', 'banana'],
  2: ['apple', 'pear', 'kiwi'],
  3: ['pear', 'banana', 'grape'],
  4: ['banana', 'grape', 'kiwi'],
  5: ['apple', 'orange', 'kiwi'],
};

// Задаємо запит у кон'юнктивній нормальній формі
const query = 'apple AND banana OR pear AND NOT kiwi';

// Використовуємо булеву модель для знаходження документів, які містять запит
const result = booleanModel(query, documents);

// Виводимо результат
console.log(result);
