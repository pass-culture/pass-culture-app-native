import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { ResendEmailValidationRequest } from 'api/gen'

export function useResendEmailValidation({
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
