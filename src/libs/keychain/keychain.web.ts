import AsyncStorage from '@react-native-async-storage/async-storage'

const REFRESH_TOKEN_KEY = 'PASSCULTURE_REFRESH_TOKEN'

export async function saveRefreshToken(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) {
    throw Error('Aucun refresh token à sauvegarder')
  }
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  } catch {
    throw Error('Keychain non accessible')
  }
}

export async function clearRefreshToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch {
    throw Error('Keychain non accessible')
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY)
  } catch {
    throw Error('Keychain non accessible')
  }
}
