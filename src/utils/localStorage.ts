export const LAST_UPDATED_KEY_SUFFIX = '-last-updated';

export const getLocalStorage = <T>(
  key: string,
  defaultState: T,
  keepAliveMs?: number
): T => {
  const localStorageData = localStorage.getItem(key);
  const localStorageLastEdited = localStorage.getItem(
    key + LAST_UPDATED_KEY_SUFFIX
  );

  if (
    localStorageData &&
    (!keepAliveMs ||
      (localStorageLastEdited &&
        Number(localStorageLastEdited) + keepAliveMs > new Date().getTime()))
  ) {
    return JSON.parse(localStorageData) as T;
  }

  return defaultState;
};

export const updateLocalStorage = <T>(key: string, state: T) => {
  localStorage.setItem(key, JSON.stringify(state));
};
