import { useMutation } from 'react-query'

import { api } from 'api/api'
import { MutationOptions } from 'features/identityCheck/api/types'

export function useSendPhoneValidationMutation({ onSuccess, onError }: MutationOptions) {
  return useMutation(
    (phoneNumber: string) => api.postnativev1sendPhoneValidationCode({ phoneNumber }),
    {
      onSuccess,
      onError,
    }
  )
}
