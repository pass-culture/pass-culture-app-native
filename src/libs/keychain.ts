import { t } from '@lingui/macro'
import * as Keychain from 'react-native-keychain'

import { _ } from './i18n'

export async function saveRefreshToken(
  username: string,
  refreshToken: string | undefined
): Promise<void> {
  if (!refreshToken) {
    throw Error(_(t`Aucun refresh token à sauvegarder`))
  }
  try {
    await Keychain.setGenericPassword(username, refreshToken)
  } catch (error) {
    throw Error(_(t`Keychain non accessible`))
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
    throw Error(_(t`Keychain non accessible`))
  }
}
