import { post } from 'libs/fetch'
import { IUser } from 'types'

type Credentials = {
  email: string
  password: string
}

export async function signin({ email, password }: Credentials): Promise<IUser> {
  const body = { identifier: email, password }
  return post<IUser>('/users/signin', { body })
}
