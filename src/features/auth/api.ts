import { Platform } from 'react-native'
import { useMutation } from 'react-query'

import { api } from 'api/api'
import { isApiError } from 'api/apiHelpers'
import { AccountRequest, SigninRequest } from 'api/gen'
import { useLoginRoutine } from 'features/auth/AuthContext'
import { useAppSettings } from 'features/auth/settings'
import { campaignTracker } from 'libs/campaign'

import { formatToFrenchDecimal } from '../../libs/parsers'

export type SignInResponse = SignInResponseSuccess | SignInResponseFailure

export type SignInResponseSuccess = {
  isSuccess: true
}

export type SignInResponseFailure = {
  isSuccess: false
  statusCode?: number
  content?: {
    code: 'EMAIL_NOT_VALIDATED' | 'NETWORK_REQUEST_FAILED'
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

interface PhoneValidationMutationsOptions {
  onSuccess: () => void
  onError: (error: unknown) => void
}

export function useSignIn(): (data: SigninRequest) => Promise<SignInResponse> {
  const loginRoutine = useLoginRoutine()

  return async (body: SigninRequest) => {
    try {
      const response = await api.postnativev1signin(body, { credentials: 'omit' })
      await loginRoutine(response, 'fromLogin')
      const successResponse: SignInResponseSuccess = { isSuccess: true }
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

export function useNotifyIdCheckCompleted(options = {}) {
  return useMutation(() => api.postnativev1accounthasCompletedIdCheck(), options)
}

export function useAccountSuspend(onSuccess: () => void, onError: (error: unknown) => void) {
  return useMutation(() => api.postnativev1accountsuspend(), {
    onSuccess,
    onError,
  })
}

export function useDepositAmount() {
  const { data: settings } = useAppSettings()
  const amount = settings?.depositAmount ?? 30000
  return formatToFrenchDecimal(amount)
}

export const SIGNUP_NUMBER_OF_STEPS = 4 // email, password, birthday, cgu

export function useSendPhoneValidationMutation({
  onSuccess,
  onError,
}: PhoneValidationMutationsOptions) {
  return useMutation(
    (phoneNumber: string) => api.postnativev1sendPhoneValidationCode({ phoneNumber }),
    {
      onSuccess,
      onError,
    }
  )
}

export function useValidatePhoneNumberMutation({
  onSuccess,
  onError,
}: PhoneValidationMutationsOptions) {
  return useMutation((code: string) => api.postnativev1validatePhoneNumber({ code }), {
    onSuccess,
    onError,
  })
}
