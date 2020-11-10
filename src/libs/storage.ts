import { t } from '@lingui/macro'
import AsyncStorage from '@react-native-community/async-storage'
import { Alert } from 'react-native'

import { _ } from 'libs/i18n'

const ACCESS_TOKEN_STORAGE_KEY = 'access_token'

export async function getAccessToken(): Promise<string | null> {
  return readString(ACCESS_TOKEN_STORAGE_KEY)
}

export async function saveAccessToken(accessToken: string | undefined): Promise<void> {
  if (!accessToken) {
    throw Error(_(t`Aucun access token à sauvegarder`))
  }
  await saveString(ACCESS_TOKEN_STORAGE_KEY, accessToken)
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
