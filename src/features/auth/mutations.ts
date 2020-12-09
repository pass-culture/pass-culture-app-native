import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ResetPasswordRequest, ValidateEmailRequest, ValidateEmailResponse } from 'api/gen'

export function useResetPasswordMutation(onSuccess: () => void) {
  return useMutation((body: ResetPasswordRequest) => api.nativeV1ResetPasswordPost(body), {
    onSuccess,
  })
}

export function useValidateEmailMutation(
  onSuccess: (response: ValidateEmailResponse) => void,
  // TODO: make this function mandatory https://passculture.atlassian.net/browse/PC-5139
  onError?: (error: unknown) => void
) {
  return useMutation((body: ValidateEmailRequest) => api.nativeV1ValidateEmailPost(body), {
    onSuccess,
    onError,
  })
}
