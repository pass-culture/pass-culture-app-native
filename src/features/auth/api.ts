import { useQuery } from 'react-query'

import { get, post } from 'libs/fetch'
import { IUser } from 'types'

type Credentials = {
  email: string
  password: string
}

export async function signin({ email, password }: Credentials): Promise<IUser> {
  const body = { identifier: email, password }
  return post<IUser>('/users/signin', { body, credentials: 'omit' })
}

export function useCurrentUser() {
  const { data: user, isFetching, refetch, error, isError } = useQuery<IUser>({
    querykey: 'currentUser',
    queryFn: async () => get<IUser>('/users/current'),
  })
  return { user, isFetching, refetch, error, isError }
}
