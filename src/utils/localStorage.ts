export const getLocalStorage = <T>(key: string, defaultState: T): T => {
  const localStorageData = localStorage.getItem(key);

  if (localStorageData) {
    return JSON.parse(localStorageData) as T;
  }

  return defaultState;
};

export const updateLocalStorage = <T>(key: string, state: T) => {
  localStorage.setItem(key, JSON.stringify(state));
};
