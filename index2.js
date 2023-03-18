const documentInput = document.getElementById('document');
const searchInput = document.getElementById('search');
const documentForm = document.getElementById('document-form');
const searchForm = document.getElementById('search-form');
const documentResult = document.getElementById('document-result');
const searchResult = document.getElementById('search-result');
const searchqueryResult = document.getElementById('search-query');
const documentSection = document.getElementById('documents-section');
const searchSection = document.getElementById('search-section');
const nextStageButton = document.getElementById('document-next-stage-button');
const documentresultSection = document.getElementById('documention-result-section');
const searchResultSection = document.getElementById('search-result-section');

documentSection.style.display = 'block';
searchSection.style.display = 'none';
// ____________________________________________________
let documents = [];
let currentDocId = 0;
let doc_vectors = [];
let idf;
const threshold = 0.4;

const onNextStageClicked = () => {
  if (!documents?.length || documents?.length < 1) {
    alert('Введіть хоча б один документ');
    return;
  }
  documentSection.style.display = 'none';
  searchSection.style.display = 'block';
  const terms = new Set();
  for (const document of documents) {
    const doc_terms = preprocess(document);
    for (const term of doc_terms) {
      terms.add(term);
    }
  }

  idf = calculate_idf(documents);
  doc_vectors = calculate_tf_idf(documents, idf);
};

const onDocumentFormSubmit = event => {
  event.preventDefault();
  const text = documentInput.value;
  if (!text) {
    alert('Введіть зміст документу');
    return;
  }
  documentresultSection.style.display = 'block';
  documents.push(text);
  document.getElementById('documention-result').innerHTML = documents
    .map((doc, i) => `document ${i + 1}: "${doc}"`)
    .join('<br>');
  documentForm.reset();
};

const onSearchFormSubmit = event => {
  event.preventDefault();
  const query = searchInput.value;
  if (!query) {
    alert('Введіть пошуковий запит');
    return;
  }
  const query_vector = create_query_vector(query, idf);

  const results = [];
  for (let i = 0; i < documents.length; i++) {
    const similarity = cosine_similarity(query_vector, doc_vectors[i]);
    if (similarity > threshold) {
      results.push([i, similarity]);
    }
  }

  results.sort((a, b) => b[1] - a[1]);

  intervals = '';

  for (const [index, similarity] of results) {
    intervals += `Значення подібності для document ${index + 1}: ${similarity.toFixed(3)}<br>`;
  }

  searchResultSection.style.display = 'block';
  searchqueryResult.innerHTML = query;
  searchResult.innerHTML = results.length ? intervals : 'Документи не знайдено';
  searchForm.reset();
};

nextStageButton.addEventListener('click', onNextStageClicked);
documentForm.addEventListener('submit', onDocumentFormSubmit);
searchForm.addEventListener('submit', onSearchFormSubmit);

// ______________________________________________________
function preprocess(text) {
  return text.toLowerCase().match(/\w+/g);
}

// Calculate IDF values for each term in documents
function calculate_idf(documents) {
  const idf = {};
  const N = documents.length;

  for (const document of documents) {
    const terms = new Set(preprocess(document));

    for (const term of terms) {
      idf[term] = (idf[term] || 0) + 1;
    }
  }

  for (const term in idf) {
    idf[term] = Math.log((N + 1) / (idf[term] + 1)) + 1;
  }

  return idf;
}

// Calculate TF-IDF scores for each term in each document
function calculate_tf_idf(documents, idf) {
  const tf_idf = [];

  for (const document of documents) {
    const tf = {};
    const terms = preprocess(document);

    for (const term of terms) {
      tf[term] = (tf[term] || 0) + 1;
    }

    const vector = [];

    for (const term in idf) {
      const tf_idf_score = (tf[term] || 0) * idf[term];
      vector.push(tf_idf_score);
    }

    tf_idf.push(vector);
  }

  return tf_idf;
}

// Create query vector using TF-IDF scores and IDF values
function create_query_vector(query, idf) {
  const tf = {};
  const terms = preprocess(query);

  for (const term of terms) {
    tf[term] = (tf[term] ?? 0) + 1;
  }

  const vector = [];

  for (const term in idf) {
    const tf_idf_score = (tf[term] || 0) * idf[term];
    vector.push(tf_idf_score);
  }

  return vector;
}

// Calculate cosine similarity between two vectors
function cosine_similarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  return dotProduct / (normA * normB);
}

// Set minimum similarity score for a document to be displayed in query results

// Example usage
// const documents = [
//   'This is the first document',
//   'This document is the second document',
//   'And this is the third one',
// ];

// const terms = new Set();
// for (const document of documents) {
//   const doc_terms = preprocess(document);
//   for (const term of doc_terms) {
//     terms.add(term);
//   }
// }

// const idf = calculate_idf(documents);
// const doc_vectors = calculate_tf_idf(documents, idf);

// const query = 'this is a query';
// const query_vector = create_query_vector(query, idf);

// const results = [];
// for (let i = 0; i < documents.length; i++) {
//   const similarity = cosine_similarity(query_vector, doc_vectors[i]);
//   if (similarity > threshold) {
//     results.push([i, similarity]);
//   }
// }

// results.sort((a, b) => b[1] - a[1]);

// console.log(`Query: "${query}"`);
// console.log(`Minimum similarity score: ${threshold}`);
// console.log(`\nSearch results:`);
// for (const [index, similarity] of results) {
//   console.log(`Document ${index + 1}: "${documents[index]}"`);
//   console.log(`Similarity score: ${similarity.toFixed(3)}\n`);
// }
