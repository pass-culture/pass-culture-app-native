import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { MutationOptions } from 'features/identityCheck/helpers/types'

export function useValidatePhoneNumberMutation({ onSuccess, onError }: MutationOptions) {
  return useMutation((code: string) => api.postNativeV1ValidatePhoneNumber({ code }), {
    onSuccess,
    onError,
  })
}
