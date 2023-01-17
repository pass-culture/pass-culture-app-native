import { Platform } from 'react-native'

import { api } from 'api/api'
import { AccountRequest } from 'api/gen'
import { campaignTracker } from 'libs/campaign'

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

      const response = await api.postnativev1account(
        { ...body, appsFlyerPlatform: Platform.OS, appsFlyerUserId },
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
