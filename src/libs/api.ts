import { t } from '@lingui/macro'

import { env } from 'libs/environment'
import { NotAuthenticatedError } from 'libs/fetch'
import { _ } from 'libs/i18n'
import { getRefreshToken } from 'libs/keychain'
import { getAccessToken } from 'libs/storage'
import {
  DefaultApiFactory,
  PasswordResetRequestRequest,
  ResetPasswordRequest,
  SigninRequest,
} from 'libs/swagger-codegen'

export enum TokenType {
  Access = 'access',
  Refresh = 'refresh',
}

const SwaggerCodegen = DefaultApiFactory(undefined, fetch, env.API_BASE_URL)

const getAuthenticationHeader = async (tokenType: TokenType) => {
  const token = tokenType === TokenType.Refresh ? await getRefreshToken() : await getAccessToken()
  if (!token) {
    return null
  }
  return getHeaderFromToken(token)
}

export const getHeaderFromToken = (token: string) => {
  return { headers: { Authorization: `Bearer ${token}`, ['Content-Type']: 'application/json' } } // the Content-Type header is added by swagger codegen but needeed for temporary "/protecter" endpoint
}

export const Api = {
  async refreshAccessToken() {
    return makeResponse(
      SwaggerCodegen.nativeV1RefreshAccessTokenPost(
        await getAuthenticationHeader(TokenType.Refresh)
      ),
      'refreshAccessToken'
    )
  },
  async requestPasswordReset(body: PasswordResetRequestRequest) {
    return makeResponse(
      SwaggerCodegen.nativeV1RequestPasswordResetPost(
        body,
        await getAuthenticationHeader(TokenType.Access)
      ),
      'requestPasswordReset'
    )
  },
  async resetPassword(body: ResetPasswordRequest) {
    return makeResponse(
      SwaggerCodegen.nativeV1ResetPasswordPost(
        body,
        await getAuthenticationHeader(TokenType.Access)
      ),
      'resetPassword'
    )
  },
  signin(body: SigninRequest) {
    return makeResponse(SwaggerCodegen.nativeV1SigninPost(body), 'signin')
  },
  // this endpoint is temporary and will be added (with another name) to SwaggerCodegen file
  async protected() {
    const response = await makeResponse(
      fetch(
        env.API_BASE_URL + '/native/v1/protected',
        (await getAuthenticationHeader(TokenType.Access)) ?? undefined
      ),
      'protected'
    )
    return (await response.json()) as ProtectedRouteResponse
  },
}

const makeResponse = <T>(response: T, endPoint: string) => {
  try {
    return response
  } catch (error) {
    if (error.status === 401) {
      throw new NotAuthenticatedError()
    }
    throw new Error(_(t`Échec de la requête "${endPoint}", code: ${error.status}`))
  }
}

export type ProtectedRouteResponse = { logged_in_as: string }
