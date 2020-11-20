import { useMutation, useQuery } from 'react-query'

import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { EmptyResponse, get, NotAuthenticatedError, post } from 'libs/fetch'
import { saveRefreshToken } from 'libs/keychain'
import { saveAccessToken } from 'libs/storage'

import {
  SigninBody,
  SigninResponse,
  CurrentUserResponse,
  PasswordResetBody,
  ResetPasswordBody,
} from './api.types'

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

export function useCurrentUser() {
  return useQuery<string | undefined>(
    'currentUser',
    async function () {
      try {
        const json = await get<CurrentUserResponse>('/native/v1/protected')
        return json.logged_in_as
      } catch (err) {
        if (err instanceof NotAuthenticatedError) return undefined
        // We don't throw an error as it is not caught on this page
        // For instance, we can receive a status 422 if the access token is invalid
        return undefined
      }
    },
    { retry: false }
  )
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

export function useResetPasswordMutation(onSuccess: () => void) {
  return useMutation(
    (body: ResetPasswordBody) => post<EmptyResponse>('/native/v1/reset_password', { body }),
    {
      onSuccess,
    }
  )
}
