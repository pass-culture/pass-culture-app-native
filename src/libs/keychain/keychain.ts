import * as Keychain from 'react-native-keychain'

const REFRESH_TOKEN_KEY = 'PASSCULTURE_REFRESH_TOKEN'

export async function saveRefreshToken(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) {
    throw Error('Aucun refresh token à sauvegarder')
  }
  try {
    await Keychain.setGenericPassword(REFRESH_TOKEN_KEY, refreshToken)
  } catch {
    throw Error('Keychain non accessible')
  }
}

export async function clearRefreshToken(): Promise<void> {
  try {
    await Keychain.resetGenericPassword()
  } catch {
    throw Error('Keychain non accessible')
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    const credentials = await Keychain.getGenericPassword()
    if (credentials) {
      return credentials.password
    }
    return null
  } catch {
    throw Error('Keychain non accessible')
  }
}
