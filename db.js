// db.js

const DB_NAME = 'costflow-db';
const DB_VERSION = 2;

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

  // Чеки
  if (!db.objectStoreNames.contains('receipts')) {
    const store = db.createObjectStore('receipts', {
      keyPath: 'id' // Date.now()
    });

    store.createIndex('uuid', 'uuid', { unique: true });
    store.createIndex('date', 'date');
  }

  // Категории
  if (!db.objectStoreNames.contains('categories')) {
    db.createObjectStore('categories', {
      keyPath: 'id' // string: 'food', 'transport'
    });
  }

  // Способы оплаты
  if (!db.objectStoreNames.contains('payments')) {
    db.createObjectStore('payments', {
      keyPath: 'id' // string: 'cash', 'card'
    });
  }
}

/* ---------- receipts API ---------- */
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

/* ---------- categories API ---------- */
export async function addCategory(category) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');

    const req = store.add(category);
    req.onsuccess = () => resolve(category);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllCategories() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('categories', 'readonly');
    const store = tx.objectStore('categories');

    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/* ---------- payments API ---------- */
export async function addPaymentMethod(method) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('payments', 'readwrite');
    const store = tx.objectStore('payments');

    const req = store.add(method);
    req.onsuccess = () => resolve(method);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllPaymentMethods() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('payments', 'readonly');
    const store = tx.objectStore('payments');

    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
