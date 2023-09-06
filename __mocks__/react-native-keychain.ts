import { Result, UserCredentials } from 'react-native-keychain'

const result: Result = {
  service: 'service',
  storage: 'storage',
}

const credentials: UserCredentials = {
  username: 'username',
  password: 'password',
  ...result,
}

export const setGenericPassword = jest.fn(async function (username: string, password: string) {
  credentials.username = username
  credentials.password = password
  return result
})

export const getGenericPassword = jest.fn(async function (): Promise<UserCredentials | false> {
  return credentials
})

export const resetGenericPassword = jest.fn(async function (): Promise<boolean> {
  credentials.password = ''
  return true
})
