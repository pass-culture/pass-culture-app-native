import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { REDIRECT_URL_UBBLE } from 'features/identityCheck/constants'
import { MutationKeys } from 'libs/queryKeys'

export const useUbbleIdentificationMutation = () =>
  useMutation({
    mutationKey: [MutationKeys.IDENTIFICATION_URL],
    mutationFn: () => api.postNativeV1UbbleIdentification({ redirectUrl: REDIRECT_URL_UBBLE }),
  })
