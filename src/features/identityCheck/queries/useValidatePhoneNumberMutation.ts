import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { MutationOptions } from 'features/identityCheck/helpers/types'

export const useValidatePhoneNumberMutation = ({ onSuccess, onError }: MutationOptions) =>
  useMutation({
    mutationFn: (code: string) => api.postNativeV1ValidatePhoneNumber({ code }),
    onSuccess,
    onError,
  })
