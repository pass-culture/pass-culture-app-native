import { Platform } from 'react-native'

import { api } from 'api/api'
import { AccountRequest } from 'api/gen'
import { campaignTracker } from 'libs/campaign'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'

type appAccountRequest = Omit<AccountRequest, 'appsFlyerPlatform' | 'appsFlyerUserId'>

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

export function useSignUp(): (data: appAccountRequest) => Promise<SignUpResponse> {
  return async (body: appAccountRequest) => {
    try {
      const appsFlyerUserId = await campaignTracker.getUserId()
      const firebasePseudoId = await firebaseAnalytics.getAppInstanceId()

      const response = await api.postNativeV1Account(
        { ...body, appsFlyerPlatform: Platform.OS, appsFlyerUserId, firebasePseudoId },
        { credentials: 'omit' }
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
