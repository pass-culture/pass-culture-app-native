import { useQuery } from 'react-query'

import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { EmptyResponse, get, NotAuthenticatedError, post } from 'libs/fetch'

export type SigninBody = {
  email: string
  password: string
}

export type SigninResponse = {
  access_token: string
  refresh_token: string
}

export async function signin({
  email,
  password,
}: SigninBody): Promise<{ access_token: string; refresh_token: string } | undefined> {
  const body = { identifier: email, password }
  try {
    const { access_token, refresh_token } = await post<SigninResponse>('/native/v1/signin', {
      body,
      credentials: 'omit',
    })
    await analytics.logLogin({ method: env.API_BASE_URL })
    return { access_token, refresh_token }
  } catch (error) {
    return
  }
}

export type CurrentUserResponse = {
  logged_in_as: string
}

export function useCurrentUser() {
  return useQuery<string | undefined>(
    'currentUser',
    async function () {
      try {
        const json = await get<CurrentUserResponse>('/native/v1/protected')
        return json.logged_in_as
      } catch (err) {
        if (err instanceof NotAuthenticatedError) return undefined
        throw err
      }
    },
    { retry: false }
  )
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
        await get<CurrentUserResponse>('/native/v1/protected')
        return true
      } catch (err) {
        if (err instanceof NotAuthenticatedError) return false
        throw err
      }
    },
    { retry: false }
  )
}
