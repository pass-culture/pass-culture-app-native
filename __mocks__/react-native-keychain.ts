import * as Keychain from 'react-native-keychain'

export const setGenericPassword = jest.fn(async function (): ReturnType<
  typeof Keychain.setGenericPassword
> {
  const result: Keychain.Result = {
    service: 'service',
    storage: 'storage',
  }
  return result
})

export const getGenericPassword = jest.fn(async function (): ReturnType<
  typeof Keychain.getGenericPassword
> {
  const credentials: Keychain.UserCredentials = {
    username: 'username',
    password: 'password',
    service: 'service',
    storage: 'storage',
  }
  return credentials
})
