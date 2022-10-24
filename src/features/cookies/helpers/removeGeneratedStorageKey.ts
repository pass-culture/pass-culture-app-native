import { storage } from 'libs/storage'

export const removeGeneratedStorageKey = async (keyToRemove: string): Promise<void> => {
  const allKeysInStorage = await storage.getAllKeys()
  if (allKeysInStorage) {
    allKeysInStorage
      .filter((key) => key.startsWith(keyToRemove))
      .forEach((key) => storage.clear(key))
  }
}
