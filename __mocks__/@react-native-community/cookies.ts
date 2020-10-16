import { Cookie, Cookies, CookieManagerStatic } from '@react-native-community/cookies'

const cookie: Cookie = {
  name: 'user_session',
  value: 'abcdefg',
  path: '/',
  domain: 'test.com',
  version: '1',
  expires: 'Thu, 1 Jan 2030 00:00:00 -0000',
  secure: true,
  httpOnly: true,
}

let cookies: Cookies = { 'test.com/': cookie }

export default class CookieManager implements CookieManagerStatic {
  set = jest.fn(async () => true)

  setFromResponse = jest.fn(async () => true)

  get = jest.fn(async () => cookies)

  getFromResponse = jest.fn(async () => cookies)

  clearAll = jest.fn(async () => {
    cookies = {}
    return true
  })

  // iOS only : do not use
  getAll = jest.fn()
  clearByName = jest.fn()
}
