import { storage } from 'libs/storage'

export const removeGeneratedStorageKey = async (keyToRemove: string): Promise<void> => {
  const allKeysInStorage = await storage.getAllKeys()
  if (allKeysInStorage) {
    allKeysInStorage.forEach((key) => key.startsWith(keyToRemove) && storage.clear(key))
  }
}
