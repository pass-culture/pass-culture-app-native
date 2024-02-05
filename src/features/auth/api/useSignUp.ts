import { Platform } from 'react-native'

import { api } from 'api/api'
import { AccountRequest, GoogleAccountRequest, SigninResponse } from 'api/gen'
import { useLoginAndRedirect } from 'features/auth/pages/signup/helpers/useLoginAndRedirect'
import { campaignTracker } from 'libs/campaign'
import { EmptyResponse } from 'libs/fetch'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'

type AppAccountRequest = AccountRequest | GoogleAccountRequest

type SignUpResponse =
  | {
      isSuccess: true
      content: undefined
    }
  | {
      isSuccess: false
      content?: {
        code: 'NETWORK_REQUEST_FAILED'
        general: string[]
      }
    }

function isSSOSignupRequest(body: AppAccountRequest): body is GoogleAccountRequest {
  return 'accountCreationToken' in body && !!body.accountCreationToken
}

function isSigninResponse(object: SigninResponse | EmptyResponse): object is SigninResponse {
  return 'accessToken' in object
}

export function useSignUp(): (data: AppAccountRequest) => Promise<SignUpResponse> {
  const loginAndRedirect = useLoginAndRedirect()
  return async (body: AppAccountRequest) => {
    try {
      const commonBody = {
        birthdate: body.birthdate,
        token: body.token,
        marketingEmailSubscription: body.marketingEmailSubscription,
        trustedDevice: body.trustedDevice,
        appsFlyerPlatform: Platform.OS,
        appsFlyerUserId: await campaignTracker.getUserId(),
        firebasePseudoId: await firebaseAnalytics.getAppInstanceId(),
      }
      const requestOptions = { credentials: 'omit' }
      const isSSOSignup = isSSOSignupRequest(body)

      const response = isSSOSignup
        ? await api.postNativeV1OauthGoogleAccount(
            {
              ...commonBody,
              accountCreationToken: body.accountCreationToken,
            },
            requestOptions
          )
        : await api.postNativeV1Account(
            {
              ...commonBody,
              email: body.email,
              password: body.password,
            },
            requestOptions
          )

      if (isSigninResponse(response)) {
        loginAndRedirect({ accessToken: response.accessToken, refreshToken: response.refreshToken })
      }

      return { isSuccess: !!response }
    } catch (error) {
      return {
        isSuccess: false,
        content: { code: 'NETWORK_REQUEST_FAILED', general: [] },
      }
    }
  }
}
