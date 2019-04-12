const LOCAL_STORAGE_APP_ID = 'map';
const LOCAL_STORAGE_VERSION = 'v1';

/**
 * Get localStorage key
 * @returns {string}
 */
const getLocalStorageKey = () => `${LOCAL_STORAGE_APP_ID}/${LOCAL_STORAGE_VERSION}`;

/**
 * Get data from localStorage
 * @returns {null|any}
 */
const getLocalStorageData = () => {
  const storageString = window.localStorage.getItem(getLocalStorageKey());
  if (!storageString) {
    return null;
  }
  return JSON.parse(storageString);
};

/**
 * Write data to localStorage
 * @param data
 */
const setLocalStorageData = data => (
  window.localStorage.setItem(getLocalStorageKey(), JSON.stringify(data))
);

/**
 * Is localStorage available
 * @returns {boolean|Storage}
 */
const isLocalStorageAvailable = () => typeof window !== 'undefined' && window.localStorage;

/**
 * Read from localStorage
 * @param key
 * @param mainEventId
 * @returns {null}
 */
export const readFromLocalStorage = (key) => {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  const data = getLocalStorageData();
  let result = null;
  if (data && typeof data[key] !== 'undefined') {
    result = data[key];
  }
  return result;
};

/**
 * Write to localStorage
 * @param key
 * @param data
 * @param mainEventId
 * @returns {null}
 */
export const writeToLocalStorage = (key, data) => {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  let storageData = getLocalStorageData();
  if (!storageData) {
    storageData = {};
  }
  storageData[key] = data;
  return setLocalStorageData(storageData);
};
