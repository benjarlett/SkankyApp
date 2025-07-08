import { Loop } from './types';

const DB_NAME = 'SkankyRemindersDB';
const DB_VERSION = 1;
const AUDIO_STORE_NAME = 'audioFiles';
const METADATA_STORE_NAME = 'metadata';
const METADATA_KEY = 'appData';


let db: IDBDatabase;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject("Error opening DB");

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const tempDb = (event.target as IDBOpenDBRequest).result;
      if (!tempDb.objectStoreNames.contains(AUDIO_STORE_NAME)) {
        tempDb.createObjectStore(AUDIO_STORE_NAME);
      }
       if (!tempDb.objectStoreNames.contains(METADATA_STORE_NAME)) {
        tempDb.createObjectStore(METADATA_STORE_NAME);
      }
    };
  });
}

export async function saveAudioFile(id: string, file: File): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(AUDIO_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(AUDIO_STORE_NAME);
    const request = store.put(file, id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getAudioFile(id: string): Promise<File | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(AUDIO_STORE_NAME, 'readonly');
    const store = transaction.objectStore(AUDIO_STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteAudioFile(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(AUDIO_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(AUDIO_STORE_NAME);
    const request = store.delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function saveMetadata(data: { loops: any[], bands: any[], setlists: any[] }): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(METADATA_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(METADATA_STORE_NAME);
        const request = store.put(data, METADATA_KEY);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}

export async function loadMetadata(): Promise<{ loops: any[], bands: any[], setlists: any[] } | null> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(METADATA_STORE_NAME, 'readonly');
        const store = transaction.objectStore(METADATA_STORE_NAME);
        const request = store.get(METADATA_KEY);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}
