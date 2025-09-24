import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { ResendEmailValidationRequest } from 'api/gen'

export const useResendEmailValidationMutation = ({
  onError,
  onSuccess,
}: {
  onError: (err: ApiError) => void
  onSuccess: () => void
}) =>
  useMutation({
    mutationFn: (body: ResendEmailValidationRequest) => api.postNativeV1ResendEmailValidation(body),
    onSuccess,
    onError,
  })
