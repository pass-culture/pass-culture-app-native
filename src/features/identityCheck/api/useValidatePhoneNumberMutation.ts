import { useMutation } from 'react-query'

import { api } from 'api/api'
import { MutationOptions } from 'features/identityCheck/api/types'

export function useValidatePhoneNumberMutation({ onSuccess, onError }: MutationOptions) {
  return useMutation((code: string) => api.postnativev1validatePhoneNumber({ code }), {
    onSuccess,
    onError,
  })
}
