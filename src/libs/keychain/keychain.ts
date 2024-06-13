import { Platform } from 'react-native'
import * as Keychain from 'react-native-keychain'

import { env } from 'libs/environment'

const REFRESH_TOKEN_KEY = 'PASSCULTURE_REFRESH_TOKEN'

// firebase sometimes overrides the default keychain credentials on iOS, see https://github.com/oblador/react-native-keychain/issues/363
const keychainOptions = Platform.OS === 'ios' ? { service: env.IOS_APP_ID } : {}

export async function saveRefreshToken(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) {
    throw Error('Aucun refresh token à sauvegarder')
  }
  try {
    await Keychain.setGenericPassword(REFRESH_TOKEN_KEY, refreshToken, keychainOptions)
  } catch {
    throw Error('Keychain non accessible')
  }
}

export async function clearRefreshToken(): Promise<void> {
  try {
    await Keychain.resetGenericPassword(keychainOptions)
  } catch {
    throw Error('Keychain non accessible')
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    const credentials = await Keychain.getGenericPassword(keychainOptions)
    if (credentials) {
      return credentials.password
    }
    return null
  } catch {
    throw Error('Keychain non accessible')
  }
}
