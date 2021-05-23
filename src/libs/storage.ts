import { t } from '@lingui/macro'
import AsyncStorage from '@react-native-community/async-storage'
import { Alert } from 'react-native'

type StorageKey =
  | 'access_token'
  | 'has_seen_tutorials'
  | 'has_accepted_cookie'
  | 'has_seen_eligible_card'
  | 'phone_validation_code_asked_at'

export const storage = {
  clear,
  readObject,
  readString,
  saveObject,
  saveString,
}

async function readString(storageKey: StorageKey): Promise<string | null> {
  try {
    return AsyncStorage.getItem(storageKey)
  } catch (error) {
    onAsyncStorageError(error)
    return null
  }
}

async function saveString(storageKey: StorageKey, value: string): Promise<void> {
  if (!value) {
    throw Error(t`Aucune valeur à sauvegarder`)
  }
  try {
    await AsyncStorage.setItem(storageKey, value)
  } catch (error) {
    onAsyncStorageError(error)
  }
}

async function readObject<ObjectType>(storageKey: StorageKey): Promise<ObjectType | null> {
  try {
    const stringifiedObject = await AsyncStorage.getItem(storageKey)
    if (stringifiedObject) {
      return JSON.parse(stringifiedObject)
    }
    return null
  } catch (error) {
    onAsyncStorageError(error)
    return null
  }
}

async function saveObject(storageKey: StorageKey, value: unknown): Promise<void> {
  try {
    const stringifiedValue = JSON.stringify(value)
    await AsyncStorage.setItem(storageKey, stringifiedValue)
  } catch (error) {
    onAsyncStorageError(error)
  }
}

async function clear(storageKey: StorageKey): Promise<void> {
  try {
    await AsyncStorage.removeItem(storageKey)
  } catch (error) {
    onAsyncStorageError(error)
  }
}

function onAsyncStorageError(error: Error | undefined): void {
  const stringifiedError = JSON.stringify(error)
  Alert.alert('AsyncStorage Error', stringifiedError)
}
