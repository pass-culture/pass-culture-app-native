import { Platform } from 'react-native'
import { getGenericPassword, resetGenericPassword, setGenericPassword } from 'react-native-keychain'

import { env } from 'libs/environment/env'

const REFRESH_TOKEN_KEY = 'PASSCULTURE_REFRESH_TOKEN'

// we need to set a string service key specific to the lib for iOS to keep the keychain persistence
const keychainOptions = Platform.OS === 'ios' ? { service: env.IOS_KEYCHAIN_SERVICE_KEY } : {}

const handleKeychainError: (error: unknown, operation: string) => never = (error, operation) => {
  const errorMessage = error instanceof Error ? error.message : 'unknown error'
  throw new Error(`[Keychain]: ${operation} error: ${errorMessage}`, { cause: error })
}

export const saveRefreshToken = async (refreshToken: string | undefined): Promise<void> => {
  if (!refreshToken) {
    throw new Error('[Keychain]: No refresh token to save')
  }
  try {
    await setGenericPassword(REFRESH_TOKEN_KEY, refreshToken, keychainOptions)
  } catch (error: unknown) {
    handleKeychainError(error, 'saving')
  }
}

export const clearRefreshToken = async (): Promise<void> => {
  try {
    await resetGenericPassword(keychainOptions)
  } catch (error: unknown) {
    handleKeychainError(error, 'deletion')
  }
}

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const credentials = await getGenericPassword(keychainOptions)
    if (credentials) {
      return credentials.password
    }
    return null
  } catch (error: unknown) {
    handleKeychainError(error, 'access')
  }
}

export const keychainStorage = {
  getItem: async (name: string) => {
    const credentials = await getGenericPassword({
      service: name,
    })
    if (!credentials) return null
    return credentials.password
  },
  setItem: async (name: string, value: string) => {
    await setGenericPassword('', value, {
      service: name,
    })
    return
  },
  removeItem: async (name: string) => {
    await resetGenericPassword({
      service: name,
    })
    return
  },
}
