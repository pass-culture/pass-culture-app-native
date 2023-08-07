import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ResetPasswordRequest } from 'api/gen'

interface MutationOptions {
  onSuccess: () => void
  onError: (error: unknown) => void
}

export const useResetPasswordMutation = ({ onSuccess, onError }: MutationOptions) => {
  return useMutation((body: ResetPasswordRequest) => api.postnativev1resetPassword(body), {
    onSuccess,
    onError,
  })
}
