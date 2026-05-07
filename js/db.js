let db;

const request = indexedDB.open(
  "ExpenseTrackerDB",
  1
);

request.onupgradeneeded = function(event){

  db = event.target.result;

  if(!db.objectStoreNames.contains("entries")){

    db.createObjectStore(
      "entries",
      {
        keyPath: "id"
      }
    );
  }
};

request.onsuccess = function(event){

  db = event.target.result;

  loadAllEntries();
  filterEntries();
  loadSummary();
};

function addEntryToDB(entry){

  const transaction = db.transaction(
    ["entries"],
    "readwrite"
  );

  const store = transaction.objectStore(
    "entries"
  );

  store.add(entry);
}

function getAllEntries(callback){

  const transaction = db.transaction(
    ["entries"],
    "readonly"
  );

  const store = transaction.objectStore(
    "entries"
  );

  const request = store.getAll();

  request.onsuccess = function(){
    callback(request.result);
  };
}

function deleteEntryFromDB(id){

  const transaction = db.transaction(
    ["entries"],
    "readwrite"
  );

  const store = transaction.objectStore(
    "entries"
  );

  store.delete(id);
}
