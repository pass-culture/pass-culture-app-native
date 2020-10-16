import { Alert } from 'react-native'

import { post } from 'libs/fetch'
import { IUser } from 'types'

type Credentials = {
  email: string
  password: string
}

export async function signin({ email, password }: Credentials): Promise<IUser | undefined> {
  const body = { identifier: email, password }
  try {
    return post<IUser>('/users/signin', { body })
  } catch (error) {
    Alert.alert('Failed to fetch cookie : ', error)
    return undefined
  }
}
