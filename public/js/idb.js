let db;
const request = indexedDB.open('budget_tracker', 1)

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_budget', {autroIncrement: true });
    //successful db created with object store    
};

request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.onLine) {
        //upload function
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    //open new transaction with database
    const transaction = db.transaction(['new_budget'], 'readwrite');

    const budgetObjectStore = transaction.budgetObjectStore('new_budget');

    budgetObjectStore.add(record);
}

function uploadBudget() {
    const transaction = db.transaction(['new_budget'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('new_budget');
    const getAll = budgetObjectStore.getAll();

    //run on successful .getAll
    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/budget', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    const transaction = db.transaction(['new_budget'], 'readwrite');
                    const budgetObjectStore = transaction.objectStore('new_budget');
                    budgetObjectStore.clear();

                    alert('Budget submitted');
                })
                    .catch(err => {
                        console.log(err);
                    });
        }
    };
}

window.addEventListener("online", uploadBudget);