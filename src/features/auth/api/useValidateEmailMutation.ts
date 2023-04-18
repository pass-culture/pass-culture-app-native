import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { ValidateEmailRequest, ValidateEmailResponse } from 'api/gen'

export function useValidateEmailMutation(
  onSuccess: (response: ValidateEmailResponse) => void,
  onError: (error: unknown) => void
) {
  return useMutation((body: ValidateEmailRequest) => api.postnativev1validateEmail(body), {
    onSuccess,
    onError,
  })
}
