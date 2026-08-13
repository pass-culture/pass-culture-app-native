import AsyncStorage from '@react-native-async-storage/async-storage'

const REFRESH_TOKEN_KEY = 'PASSCULTURE_REFRESH_TOKEN'

const handleKeychainError = (error: unknown, operation: string): never => {
  const errorMessage = error instanceof Error ? error.message : 'unknown error'
  throw new Error(`[Keychain]: ${operation} error: ${errorMessage}`)
}

export const saveRefreshToken = async (refreshToken: string | undefined): Promise<void> => {
  if (!refreshToken) {
    throw new Error('[Keychain]: No refresh token to save')
  }
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  } catch (error: unknown) {
    handleKeychainError(error, 'saving')
  }
}

export const clearRefreshToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch (error: unknown) {
    handleKeychainError(error, 'deletion')
  }
}

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY)
  } catch (error: unknown) {
    handleKeychainError(error, 'access')
    return null
  }
}

export const keychainStorage = {
  getItem: async (name: string) => (await cookieStore.get(name))?.value || null,
  setItem: async (name: string, value: string) => cookieStore.set(name, value),
  removeItem: async (name: string) => cookieStore.delete(name),
}
