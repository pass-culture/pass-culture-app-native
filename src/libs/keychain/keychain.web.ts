import AsyncStorage from '@react-native-async-storage/async-storage'

const REFRESH_TOKEN_KEY = 'PASSCULTURE_REFRESH_TOKEN'

function handleKeychainError(error: unknown, operation: string): never {
  const errorMessage = error instanceof Error ? error.message : 'unknown error'
  throw new Error(`[Keychain]: ${operation} error: ${errorMessage}`)
}

export async function saveRefreshToken(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) {
    throw new Error('[Keychain]: No refresh token to save')
  }
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  } catch (error: unknown) {
    handleKeychainError(error, 'saving')
  }
}

export async function clearRefreshToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch (error: unknown) {
    handleKeychainError(error, 'deletion')
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY)
  } catch (error: unknown) {
    handleKeychainError(error, 'access')
  }
}
