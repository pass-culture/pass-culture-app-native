import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ValidateEmailRequest, ValidateEmailResponse } from 'api/gen'

export function useValidateEmailMutation(
  onSuccess: (response: ValidateEmailResponse) => void,
  onError: (error: unknown) => void
) {
  return useMutation((body: ValidateEmailRequest) => api.postNativeV1ValidateEmail(body), {
    onSuccess,
    onError,
  })
}
