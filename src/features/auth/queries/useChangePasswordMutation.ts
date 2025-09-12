import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { ChangePasswordRequest } from 'api/gen'

export const useChangePasswordMutation = (
  onSuccess?: () => void,
  onError?: (error: unknown) => void
) =>
  useMutation({
    mutationFn: (body: ChangePasswordRequest) => api.postNativeV1ChangePassword(body),
    onSuccess,
    onError,
  })
