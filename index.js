const termInput = document.getElementById('term');
const documentInput = document.getElementById('document');
const searchInput = document.getElementById('search');
const termForm = document.getElementById('term-form');
const documentForm = document.getElementById('document-form');
const searchForm = document.getElementById('search-form');
const termResult = document.getElementById('term-result');
const documentResult = document.getElementById('document-result');
const searchResult = document.getElementById('search-result');
const termSection = document.getElementById('terms-section');
const documentSection = document.getElementById('documents-section');
const searchSection = document.getElementById('search-section');
const termResultSection = document.getElementById('terms-result-section');

documentSection.style.display="none";
searchSection.style.display="none";
// ____________________________________________________
let terms;

const onTermFormSubmit = (event) => {
    event.preventDefault();
    const text = termInput.value || [];
    if(!text) {
        return;
    }
    terms = new Set(text.split(','));
    termSection.style.display="none";
    termResultSection.style.display="block";
    document.getElementById('terms-result').innerHTML = text;
    documentSection.style.display="block";
};

termForm.addEventListener('submit', onTermFormSubmit);

// Оголошуємо множини документів та заповнюємо їх елементами
const documents = new Set(['document1', 'document2', 'document3']);
const relevantDocuments = new Set(['document1', 'document2']);

// Використовуємо операції об'єднання, перетину та різниці множин для обчислення результатів пошуку
const union = new Set([...documents, ...relevantDocuments]); // об'єднання множин
const intersection = new Set([...documents].filter(x => relevantDocuments.has(x))); // перетин множин
const difference = new Set([...documents].filter(x => !relevantDocuments.has(x))); // різниця множин

// Виводимо результати пошуку в консоль
console.log('Union:', union);
console.log('Intersection:', intersection);
console.log('Difference:', difference);
