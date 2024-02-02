import { Platform } from 'react-native'

import { api } from 'api/api'
import { AccountRequest, GoogleAccountRequest } from 'api/gen'
import { campaignTracker } from 'libs/campaign'
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

export function useSignUp(): (data: AppAccountRequest) => Promise<SignUpResponse> {
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
      return { isSuccess: !!response }
    } catch (error) {
      return {
        isSuccess: false,
        content: { code: 'NETWORK_REQUEST_FAILED', general: [] },
      }
    }
  }
}
