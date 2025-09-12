import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { ValidateEmailRequest, ValidateEmailResponse } from 'api/gen'

export const useValidateEmailMutation = (
  onSuccess: (response: ValidateEmailResponse) => void,
  onError: (error: unknown) => void
) =>
  useMutation({
    mutationFn: (body: ValidateEmailRequest) => api.postNativeV1ValidateEmail(body),
    onSuccess,
    onError,
  })
