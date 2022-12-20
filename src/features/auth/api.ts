import { Platform } from 'react-native'
import { useMutation } from 'react-query'

import { api } from 'api/api'
import { isApiError } from 'api/apiHelpers'
import { AccountRequest, AccountState, SigninRequest } from 'api/gen'
import { useLoginRoutine } from 'features/auth/login/useLoginRoutine'
import { useSettingsContext } from 'features/auth/SettingsContext'
import { campaignTracker } from 'libs/campaign'

import { formatToFrenchDecimal } from '../../libs/parsers'

export type SignInResponse = SignInResponseSuccess | SignInResponseFailure

export type SignInResponseSuccess = {
  isSuccess: true
  accountState: AccountState
}

export type SignInResponseFailure = {
  isSuccess: false
  statusCode?: number
  content?: {
    code: 'ACCOUNT_DELETED' | 'EMAIL_NOT_VALIDATED' | 'NETWORK_REQUEST_FAILED'
    general: string[]
  }
}

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

export function useSignIn(): (data: SigninRequest) => Promise<SignInResponse> {
  const loginRoutine = useLoginRoutine()

  return async (body: SigninRequest) => {
    try {
      const response = await api.postnativev1signin(body, { credentials: 'omit' })
      await loginRoutine(response, 'fromLogin')
      const successResponse: SignInResponseSuccess = {
        isSuccess: true,
        accountState: response.accountState,
      }
      return successResponse
    } catch (error) {
      const errorResponse: SignInResponseFailure = { isSuccess: false }
      if (isApiError(error)) {
        errorResponse.statusCode = error.statusCode
        errorResponse.content = error.content
      } else {
        errorResponse.content = { code: 'NETWORK_REQUEST_FAILED', general: [] }
      }
      return errorResponse
    }
  }
}

type appAccountRequest = Omit<AccountRequest, 'appsFlyerPlatform' | 'appsFlyerUserId'>

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

export function useAccountSuspend(onSuccess: () => void, onError: (error: unknown) => void) {
  return useMutation(() => api.postnativev1accountsuspend(), {
    onSuccess,
    onError,
  })
}

export function useDepositAmountsByAge() {
  const { data: settings } = useSettingsContext()
  const fifteenYearsOldAmount = settings?.depositAmountsByAge?.age_15 ?? 2000
  const sixteenYearsOldAmount = settings?.depositAmountsByAge?.age_16 ?? 3000
  const seventeenYearsOldAmount = settings?.depositAmountsByAge?.age_17 ?? 3000
  const eighteenYearsOldAmount = settings?.depositAmountsByAge?.age_18 ?? 30000

  const amountsByAge = {
    fifteenYearsOldDeposit: formatToFrenchDecimal(fifteenYearsOldAmount),
    sixteenYearsOldDeposit: formatToFrenchDecimal(sixteenYearsOldAmount),
    seventeenYearsOldDeposit: formatToFrenchDecimal(seventeenYearsOldAmount),
    eighteenYearsOldDeposit: formatToFrenchDecimal(eighteenYearsOldAmount),
  }
  return { ...amountsByAge }
}

export const SIGNUP_NUMBER_OF_STEPS = 4 // email, password, birthday, cgu
