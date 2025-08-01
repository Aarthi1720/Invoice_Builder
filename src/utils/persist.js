import localforage from "localforage";

export async function saveToStorage(key, value) {
  await localforage.setItem(key, value);
}

export async function getFromStorage(key, fallback) {
  const val = await localforage.getItem(key);
  return val ?? fallback;
}
