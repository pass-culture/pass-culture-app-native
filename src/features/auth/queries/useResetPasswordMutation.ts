import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ResetPasswordRequest, ResetPasswordResponse } from 'api/gen'

interface MutationOptions {
  onSuccess: (response: ResetPasswordResponse) => void
  onError: (error: unknown) => void
}

export const useResetPasswordMutation = ({ onSuccess, onError }: MutationOptions) => {
  return useMutation((body: ResetPasswordRequest) => api.postNativeV1ResetPassword(body), {
    onSuccess,
    onError,
  })
}
