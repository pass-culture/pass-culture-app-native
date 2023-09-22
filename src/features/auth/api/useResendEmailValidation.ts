import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { ResendEmailValidationRequest } from 'api/gen'

export function useResendEmailValidation({ onError }: { onError: (err: ApiError) => void }) {
  return useMutation(
    (body: ResendEmailValidationRequest) => api.postNativeV1ResendEmailValidation(body),
    {
      onError,
    }
  )
}
