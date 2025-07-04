import { MutationOptions, useMutation } from '@tanstack/react-query'

import { api } from 'api/api'

export function useSendPhoneValidationMutation({
  onSuccess,
  onError,
}: MutationOptions<unknown, unknown, string>) {
  return useMutation(
    ['sendPhoneValidation'],
    (phoneNumber: string) => api.postNativeV1SendPhoneValidationCode({ phoneNumber }),
    { onSuccess, onError }
  )
}
