var dbPromise = idb.open('posts-store', 1, function (db) {
  if (!db.objectStoreNames.contains('posts')) {
    db.createObjectStore('posts', {keyPath: 'id'});
  }
  if (!db.objectStoreNames.contains('sync-posts')) {
    db.createObjectStore('sync-posts', {keyPath: 'id'});
  }
});

function writeData(st, data) {
  return dbPromise
    .then((db) => {
      var tx = db.transaction(st, 'readwrite');
      var store = tx.objectStore(st);
      store.put(data);
      return tx.complete;
    });
}

function readAllData(st) {
  return dbPromise
    .then((db) => {
      var tx = db.transaction(st, 'readonly');
      var store = tx.objectStore(st);
      return store.getAll();
    });
}

function clearAllData(st) {
  return dbPromise
  .then( (db) => {
    let tx = db.transaction(st, 'readwrite');
    let store = tx.objectStore(st);
    store.clear();
    return tx.complete;
  });
}

function deleteItem(st, id) {
  return dbPromise
    .then( (db) => {
      let tx = db.transaction(st, 'readwrite');
      let store = db.objectStore(st);
      store.delete(id);
      return tx.complete;
    })
    .then( () => {
      console.log('item deleted');
    })
}

function urlBase64ToUint8Array(base64String) {
  let padding = '='.repeat((4 - base64String.length % 4) % 4);
  let base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '+');

  let rawData = window.atob(base64);
  let outputArray = new Uint8Array(rawData.length);
  
  for (let i=0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}