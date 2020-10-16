import AsyncStorage from '@react-native-community/async-storage'

const COOKIE_STORAGE_KEY = 'cookie'

export async function getCookie(): Promise<string | null> {
  return await AsyncStorage.getItem(COOKIE_STORAGE_KEY)
}

export async function setCookieFromResponse(response: Response): Promise<void> {
  const cookie = response.headers.get('set-cookie')
  if (!cookie) {
    throw Error('No cookie in response')
  }
  await AsyncStorage.setItem(COOKIE_STORAGE_KEY, cookie)
}
