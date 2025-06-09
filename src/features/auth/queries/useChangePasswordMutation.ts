import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { ChangePasswordRequest } from 'api/gen'

export function useChangePasswordMutation(
  onSuccess?: () => void,
  onError?: (error: unknown) => void
) {
  return useMutation((body: ChangePasswordRequest) => api.postNativeV1ChangePassword(body), {
    onSuccess,
    onError,
  })
}
