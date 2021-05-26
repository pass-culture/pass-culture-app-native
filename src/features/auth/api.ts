import { useMutation, useQuery } from 'react-query'

import { api } from 'api/api'
import { AccountRequest, GetIdCheckTokenResponse, SigninRequest } from 'api/gen'
import { ApiError, isApiError } from 'api/helpers'
import { useAuthContext, useLoginRoutine } from 'features/auth/AuthContext'
import { useAppSettings } from 'features/auth/settings'
import { QueryKeys } from 'libs/queryKeys'

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

export function useSignUp(): (data: AccountRequest) => Promise<SignUpResponse> {
  return async (body: AccountRequest) => {
    try {
      const response = await api.postnativev1account(body, { credentials: 'omit' })
      return { isSuccess: !!response }
    } catch (error) {
      return {
        isSuccess: false,
        content: { code: 'NETWORK_REQUEST_FAILED', general: [] },
      }
    }
  }
}

export function useGetIdCheckToken(
  queryCondition?: boolean,
  onError?: (error: ApiError | unknown) => void
) {
  queryCondition = queryCondition ?? true

  const { isLoggedIn } = useAuthContext()

  return useQuery<GetIdCheckTokenResponse>(
    QueryKeys.ID_CHECK_TOKEN,
    () => api.getnativev1idCheckToken(),
    {
      enabled: queryCondition && isLoggedIn,
      onError,
    }
  )
}

export function useNotifyIdCheckCompleted(options = {}) {
  return useMutation(() => api.postnativev1accounthasCompletedIdCheck(), options)
}

export function useNotifyAccountSuspend(onSuccess: () => void) {
  return useMutation(() => api.postnativev1accountSuspend(), {
    onSuccess,
  })
}

export function useDepositAmount() {
  const { data: settings } = useAppSettings()
  const amount = settings?.depositAmount ?? 30000
  return formatToFrenchDecimal(amount)
}

export function useSignInNumberOfSteps() {
  // FIXME: we disabled this after gen cause it was displaying postal code during registration
  const signInNumberOfSteps = 4
  return signInNumberOfSteps
  // const { data: settings } = useAppSettings()
  // return settings?.wholeFranceOpening ? 4 : 5
}

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
