import { useQuery } from 'react-query'

import { EmptyResponse, get, NotAuthenticatedError, post } from 'libs/fetch'

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
