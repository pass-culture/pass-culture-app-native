import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ResetPasswordRequest } from 'api/gen'

export function useResetPasswordMutation(onSuccess: () => void) {
  return useMutation((body: ResetPasswordRequest) => api.postnativev1resetPassword(body), {
    onSuccess,
  })
}
