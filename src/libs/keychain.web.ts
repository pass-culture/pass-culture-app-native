import { t } from '@lingui/macro'
import AsyncStorage from '@react-native-async-storage/async-storage'

const REFRESH_TOKEN_KEY = 'PASSCULTURE_REFRESH_TOKEN'

export async function saveRefreshToken(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) {
    throw Error(t`Aucun refresh token à sauvegarder`)
  }
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  } catch (error) {
    throw Error(t`Keychain non accessible`)
  }
}

export async function clearRefreshToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch (error) {
    throw Error(t`Keychain non accessible`)
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    const credentials = { password: await AsyncStorage.getItem(REFRESH_TOKEN_KEY) }
    if (credentials) {
      return (credentials as unknown as { password: string }).password
    }
    return null
  } catch (error) {
    throw Error(t`Keychain non accessible`)
  }
}
