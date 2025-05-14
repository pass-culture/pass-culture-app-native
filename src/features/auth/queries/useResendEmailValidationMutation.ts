import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { ResendEmailValidationRequest } from 'api/gen'

export function useResendEmailValidationMutation({
  onError,
  onSuccess,
}: {
  onError: (err: ApiError) => void
  onSuccess: () => void
}) {
  return useMutation(
    (body: ResendEmailValidationRequest) => api.postNativeV1ResendEmailValidation(body),
    {
      onSuccess,
      onError,
    }
  )
}
