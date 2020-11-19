import { useQuery } from 'react-query'

import { analytics } from 'libs/analytics'
import { Api } from 'libs/api'
import { env } from 'libs/environment'
import { saveRefreshToken } from 'libs/keychain'
import { saveAccessToken } from 'libs/storage'
import { PasswordResetRequestRequest, SigninRequest } from 'libs/swagger-codegen'

export async function signin(body: SigninRequest): Promise<boolean> {
  try {
    const { access_token, refresh_token } = await Api.signin(body)
    await saveRefreshToken(body.identifier, refresh_token)
    await saveAccessToken(access_token)
    await analytics.logLogin({ method: env.API_BASE_URL })
    return true
  } catch (error) {
    return false
  }
}

export function useCurrentUser() {
  const { data: email, isFetching, refetch, error, isError } = useQuery<string>({
    querykey: 'currentUser',
    queryFn: async function () {
      const json = await Api.protected()
      return json.logged_in_as
    },
  })
  return { email, isFetching, refetch, error, isError }
}

export type PasswordResetBody = {
  email: string
}

export async function requestPasswordReset(body: PasswordResetRequestRequest) {
  return await Api.requestPasswordReset(body)
}
