import { MutationOptions, useMutation } from '@tanstack/react-query'

import { api } from 'api/api'

export const useSendPhoneValidationMutation = ({
  onSuccess,
  onError,
}: MutationOptions<unknown, unknown, string>) =>
  useMutation({
    mutationKey: ['sendPhoneValidation'],
    mutationFn: (phoneNumber: string) => api.postNativeV1SendPhoneValidationCode({ phoneNumber }),
    onSuccess,
    onError,
  })
