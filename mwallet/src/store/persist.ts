import { atom } from "jotai";
import { get, set, del } from "idb-keyval";

export const createJSONStorage = () => ({
  getItem: async (key: string) => {
    const item = await get(key);
    return item ? JSON.stringify(item) : null;
  },
  setItem: async (key: string, value: string) => {
    await set(key, JSON.parse(value));
  },
  removeItem: async (key: string) => {
    await del(key);
  },
});

export const createPersistedAtom = <T>(key: string, initialValue: T) => {
  const storage = createJSONStorage();
  const baseAtom = atom(initialValue);
  baseAtom.onMount = (setValue) => {
    async function loadPersistedValue(key: string, initialValue: any) {
      const item = await storage.getItem(key);
      const persistedValue = item !== null ? JSON.parse(item) : initialValue;
      if (persistedValue !== initialValue) {
        setValue(persistedValue);
      }
    }
    loadPersistedValue(key, initialValue);
  };
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: T | ((prev: T) => T)) => {
      const nextValue =
        typeof update === "function"
          ? (update as (prev: T) => T)(get(baseAtom))
          : update;
      set(baseAtom, nextValue);
      storage.setItem(key, JSON.stringify(nextValue));
    }
  );

  return derivedAtom;
};
