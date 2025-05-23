import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { ResetPasswordRequest } from 'api/gen'

export const useChangeEmailSetPasswordMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void
  onError: () => void
}) => {
  return useMutation(
    (body: ResetPasswordRequest) => api.postNativeV2ProfileEmailUpdateNewPassword(body),
    { onSuccess, onError }
  )
}
