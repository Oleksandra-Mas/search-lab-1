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
const nextStageButton = document.getElementById('document-next-stage-button');
const documentresultSection = document.getElementById('documention-result-section');

documentSection.style.display="none";
searchSection.style.display="none";
documentresultSection.style.display="none";
// ____________________________________________________
let terms;
let documents=[];
let currentTermId =1;
let currentDocId = 1;

const onTermFormSubmit = (event) => {
    event.preventDefault();
    const text = termInput.value;
    if(!text){
        alert('Введіть хоча б один терм')
        return;
    }
    terms = text.split(', ').map(line=>{
        const result ={id:currentTermId, term:line};
        currentTermId+=1;
        return result;
    });
    
    const termsToDisplay = terms.map(term=>`term ${term.id}: "${term.term}"`).join('<br>');
    termSection.style.display="none";
    termResultSection.style.display="block";
    document.getElementById('terms-result').innerHTML = termsToDisplay;
    documentSection.style.display="block";
};

const onNextStageClicked = () =>{
    console.log(documents?.length);
    if(!documents?.length || documents?.length<1){
        alert('Введіть хоча б один документ');
        return
    }
    documentSection.style.display='none';
    searchSection.style.display='block';
};

const onDocumentFormSubmit = (event) => {
    event.preventDefault();
    const text = documentInput.value;
    if(!text) {
        return;
    }
    documentresultSection.style.display="block";
    documents.push({id: currentDocId,text});
    currentDocId+=1;
    document.getElementById('documention-result').innerHTML = documents.map(doc=>`document ${doc.id}: "${doc.text}"`).join('<br>');
    documentForm.reset();
};

termForm.addEventListener('submit', onTermFormSubmit);
nextStageButton.addEventListener('click', onNextStageClicked);
documentForm.addEventListener('submit', onDocumentFormSubmit);

// Define the documents in the collection
// const docs = [
//     { id: 1, text: "The quick brown fox jumps over the lazy dog" },
//     { id: 2, text: "The quick brown fox jumps over the quick dog" },
//     { id: 3, text: "The quick red fox jumps over the lazy dog" },
//     { id: 4, text: "The quick brown cat jumps over the lazy dog" },
//   ];
  
//   // Define the index of terms in the collection
//   const index = {
//     the: [1, 2, 3, 4],
//     quick: [1, 2, 3],
//     brown: [1, 2, 4],
//     fox: [1, 2, 3],
//     jumps: [1, 2, 3, 4],
//     over: [1, 2, 3, 4],
//     lazy: [1, 3, 4],
//     dog: [1, 2, 3, 4],
//     red: [3],
//     cat: [4],
//   };
  
//   // Define the query
//   const query = "quick AND brown AND fox";
  
//   // Tokenize the query
//   const termss = query.split(/\s+/);
  
//   // Retrieve the document IDs for each term
//   const termDocs = termss.map((term) => index[term]);
  
//   // Compute the intersection of document IDs for all terms
//   const results = termDocs.reduce((acc, cur) => {
//     return acc.filter((id) => cur.includes(id));
//   });
  
//   // Print the results
//   console.log(results);
  