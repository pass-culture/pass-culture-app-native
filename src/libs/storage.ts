import { t } from '@lingui/macro'
import AsyncStorage from '@react-native-community/async-storage'
import { Alert } from 'react-native'

import { _ } from 'libs/i18n'

const TOKEN_STORAGE_KEY = 'authent_token'

export async function getToken(): Promise<string | null> {
  return readString(TOKEN_STORAGE_KEY)
}

export async function saveToken(token: string | undefined): Promise<void> {
  if (!token) {
    throw Error(_(t`Aucun token à sauvegarder`))
  }
  await saveString(TOKEN_STORAGE_KEY, token)
}

async function readString(storageKey: string): Promise<string | null> {
  try {
    return AsyncStorage.getItem(storageKey)
  } catch (error) {
    onAsyncStorageError(error)
    return null
  }
}

async function saveString(storageKey: string, value: string) {
  try {
    await AsyncStorage.setItem(storageKey, value)
  } catch (error) {
    onAsyncStorageError(error)
  }
}

function onAsyncStorageError(error: Error | undefined): void {
  const stringifiedError = JSON.stringify(error)
  Alert.alert('AsyncStorage Error', stringifiedError)
}
