import * as Keychain from 'react-native-keychain'

import { env } from 'libs/environment'

export async function storeRefreshToken(
  username: string,
  refreshToken: string
): Promise<false | Keychain.Result> {
  // const options = {
  //   accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  //   accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
  //   securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
  // }
  return await Keychain.setInternetCredentials(env.API_BASE_URL, username, refreshToken)
}

export async function getRefreshToken(): Promise<false | string> {
  const credentials = await Keychain.getInternetCredentials(env.API_BASE_URL)
  if (credentials) {
    return credentials.password
  } else {
    return false
  }
}
