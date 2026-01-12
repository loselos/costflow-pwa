// db.js

const DB_NAME = 'costflow-db';
const DB_VERSION = 1;

/* ---------- open ---------- */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      initSchema(db);
    };
  });
}

/* ---------- schema ---------- */
function initSchema(db) {

  if (!db.objectStoreNames.contains('receipts')) {
    const store = db.createObjectStore('receipts', {
      keyPath: 'id'
    });

    store.createIndex('uuid', 'uuid', { unique: true });
    store.createIndex('date', 'date');
  }
}

/* ---------- api ---------- */
export async function addReceipt(receipt) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('receipts', 'readwrite');
    const store = tx.objectStore('receipts');

    const req = store.add(receipt);
    req.onsuccess = () => resolve(receipt);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllReceipts() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('receipts', 'readonly');
    const store = tx.objectStore('receipts');

    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteReceipt(id) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('receipts', 'readwrite');
    const store = tx.objectStore('receipts');

    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
