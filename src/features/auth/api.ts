import { useQuery } from 'react-query'

import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { EmptyResponse, get, post } from 'libs/fetch'
import { saveRefreshToken } from 'libs/keychain'
import { saveAccessToken } from 'libs/storage'

export type SigninBody = {
  email: string
  password: string
}

export type SigninResponse = {
  access_token: string
  refresh_token: string
}

export async function signin({ email, password }: SigninBody): Promise<boolean> {
  const body = { identifier: email, password }
  try {
    const { access_token, refresh_token } = await post<SigninResponse>('/native/v1/signin', {
      body,
      credentials: 'omit',
    })
    await saveRefreshToken(email, refresh_token)
    await saveAccessToken(access_token)
    await analytics.logLogin({ method: env.API_BASE_URL })
    return true
  } catch (error) {
    return false
  }
}

export type CurrentUserResponse = {
  logged_in_as: string
}

export function useCurrentUser() {
  const { data: email, isFetching, refetch, error, isError } = useQuery<string>({
    querykey: 'currentUser',
    queryFn: async function () {
      const json = await get<CurrentUserResponse>('/native/v1/protected')
      return json.logged_in_as
    },
  })
  return { email, isFetching, refetch, error, isError }
}

export type PasswordResetBody = {
  email: string
}

export async function requestPasswordReset(email: PasswordResetBody): Promise<EmptyResponse> {
  const body = email
  const response = await post<EmptyResponse>('/native/v1/request_password_reset', {
    body,
  })
  return response
}

// TODO(antoineg): This is a temporary hook. Will be removed with PC-5294
export function useIsLoggedIn() {
  return useQuery<boolean>(
    'currentUser',
    async function () {
      try {
        const json = await get<CurrentUserResponse>('/native/v1/protected')
        return !!json.logged_in_as
      } catch (error) {
        return false
      }
    },
    { retry: false }
  )
}
