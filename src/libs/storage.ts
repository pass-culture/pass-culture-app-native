import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native'

export type StorageKey =
  | 'access_token'
  | 'campaign_date'
  | 'cookies_consent'
  | 'first_time_review_has_been_requested'
  | 'has_accepted_cookie'
  | 'has_seen_birthday_notification_card'
  | 'has_seen_eligible_card'
  | 'has_seen_push_notifications_modal_once'
  | 'has_seen_tutorials'
  | 'phone_validation_code_asked_at'
  | 'react_navigation_persistence'
  | 'times_review_has_been_requested'
  | 'traffic_campaign'
  | 'traffic_medium'
  | 'traffic_source'

export const storage = {
  clear,
  getAllKeys,
  readObject,
  readString,
  readMultiString,
  saveObject,
  saveString,
  saveMultiString,
}

async function readString(storageKey: StorageKey): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(storageKey)
  } catch (error) {
    if (error instanceof Error) onAsyncStorageError(error)
    return null
  }
}

async function readMultiString(
  storageKeys: StorageKey[]
): Promise<readonly [string, string | null][]> {
  try {
    return await AsyncStorage.multiGet(storageKeys)
  } catch (error) {
    if (error instanceof Error) onAsyncStorageError(error)
    return []
  }
}

async function saveString(storageKey: StorageKey, value: string): Promise<void> {
  if (!value) {
    throw Error('Aucune valeur à sauvegarder')
  }
  try {
    await AsyncStorage.setItem(storageKey, value)
  } catch (error) {
    if (error instanceof Error) onAsyncStorageError(error)
  }
}

async function saveMultiString(keyValuePairs: Array<[StorageKey, string]>): Promise<void> {
  if (!keyValuePairs.length) {
    throw Error('Aucune valeur à sauvegarder')
  }
  try {
    await AsyncStorage.multiSet(keyValuePairs)
  } catch (error) {
    if (error instanceof Error) onAsyncStorageError(error)
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
    if (error instanceof Error) onAsyncStorageError(error)
    return null
  }
}

async function saveObject(storageKey: StorageKey, value: unknown): Promise<void> {
  try {
    const stringifiedValue = JSON.stringify(value)
    await AsyncStorage.setItem(storageKey, stringifiedValue)
  } catch (error) {
    if (error instanceof Error) onAsyncStorageError(error)
  }
}

async function clear(storageKey: StorageKey): Promise<void> {
  try {
    await AsyncStorage.removeItem(storageKey)
  } catch (error) {
    if (error instanceof Error) onAsyncStorageError(error)
  }
}

async function getAllKeys(): Promise<readonly StorageKey[] | void> {
  try {
    return (await AsyncStorage.getAllKeys()) as StorageKey[]
  } catch (error) {
    if (error instanceof Error) onAsyncStorageError(error)
  }
}

function onAsyncStorageError(error: Error | undefined): void {
  const stringifiedError = JSON.stringify(error)
  Alert.alert('AsyncStorage Error', stringifiedError)
}
