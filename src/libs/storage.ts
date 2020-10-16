import { t } from '@lingui/macro'
import AsyncStorage from '@react-native-community/async-storage'

import { _ } from 'libs/i18n'

const COOKIE_STORAGE_KEY = 'cookie'

export async function getCookie(): Promise<string | null> {
  return await AsyncStorage.getItem(COOKIE_STORAGE_KEY)
}

export async function setCookieFromResponse(response: Response): Promise<void> {
  const cookie = response.headers.get('set-cookie')
  if (!cookie) {
    throw Error(_(/*i18n setCookieFromResponse error */ t`La réponse ne contient pas de cookie`))
  }
  await AsyncStorage.setItem(COOKIE_STORAGE_KEY, cookie)
}
