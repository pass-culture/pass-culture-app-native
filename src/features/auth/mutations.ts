import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ResetPasswordRequest } from 'api/gen'

export function useResetPasswordMutation(onSuccess: () => void) {
  return useMutation((body: ResetPasswordRequest) => api.nativeV1ResetPasswordPost(body), {
    onSuccess,
  })
}
