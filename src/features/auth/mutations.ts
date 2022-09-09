import { useMutation } from 'react-query'

import { api } from 'api/api'
import {
  ChangePasswordRequest,
  ResetPasswordRequest,
  ValidateEmailRequest,
  ValidateEmailResponse,
} from 'api/gen'

export function useResetPasswordMutation(onSuccess: () => void) {
  return useMutation((body: ResetPasswordRequest) => api.postnativev1resetPassword(body), {
    onSuccess,
  })
}

export function useValidateEmailMutation(
  onSuccess: (response: ValidateEmailResponse) => void,
  onError: (error: unknown) => void
) {
  return useMutation((body: ValidateEmailRequest) => api.postnativev1validateEmail(body), {
    onSuccess,
    onError,
  })
}

export function useChangePasswordMutation(
  onSuccess?: () => void,
  onError?: (error: unknown) => void
) {
  return useMutation((body: ChangePasswordRequest) => api.postnativev1changePassword(body), {
    onSuccess,
    onError,
  })
}
