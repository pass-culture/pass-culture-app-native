import { Result, UserCredentials } from 'react-native-keychain'

export const setGenericPassword = jest.fn(async function () {
  const result: Result = {
    service: 'service',
    storage: 'storage',
  }
  return result
})

export const getGenericPassword = jest.fn(async function (): Promise<UserCredentials | false> {
  const credentials: UserCredentials = {
    username: 'username',
    password: 'password',
    service: 'service',
    storage: 'storage',
  }
  return credentials
})
