import { Platform } from 'react-native'
import { getGenericPassword, resetGenericPassword, setGenericPassword } from 'react-native-keychain'

const REFRESH_TOKEN_KEY = 'PASSCULTURE_REFRESH_TOKEN'

// firebase sometimes overrides the default keychain credentials on iOS, see https://github.com/oblador/react-native-keychain/issues/363
const keychainOptions = Platform.OS === 'ios' ? { service: 'service_key' } : {}

function handleKeychainError(error: unknown, operation: string): never {
  const errorMessage = error instanceof Error ? error.message : 'unknown error'
  throw Error(`[Keychain]: ${operation} error: ${errorMessage}`)
}

export async function saveRefreshToken(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) {
    throw Error('[Keychain]: No refresh token to save')
  }
  try {
    await setGenericPassword(REFRESH_TOKEN_KEY, refreshToken, keychainOptions)
  } catch (error: unknown) {
    handleKeychainError(error, 'saving')
  }
}

export async function clearRefreshToken(): Promise<void> {
  try {
    await resetGenericPassword(keychainOptions)
  } catch (error: unknown) {
    handleKeychainError(error, 'deletion')
  }
}

export async function getRefreshToken(): Promise<string | null> {
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
