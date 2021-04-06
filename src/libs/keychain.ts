import { t } from '@lingui/macro'
import * as Keychain from 'react-native-keychain'

const REFRESH_TOKEN_KEY = 'PASSCULTURE_REFRESH_TOKEN'

export async function saveRefreshToken(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) {
    throw Error(t`Aucun refresh token à sauvegarder`)
  }
  try {
    await Keychain.setGenericPassword(REFRESH_TOKEN_KEY, refreshToken)
  } catch (error) {
    throw Error(t`Keychain non accessible`)
  }
}

export async function clearRefreshToken(): Promise<void> {
  try {
    await Keychain.resetGenericPassword()
  } catch (error) {
    throw Error(t`Keychain non accessible`)
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    const credentials = await Keychain.getGenericPassword()
    if (credentials) {
      return credentials.password
    }
    return null
  } catch (error) {
    throw Error(t`Keychain non accessible`)
  }
}
