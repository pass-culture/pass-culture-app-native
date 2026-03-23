import { useMutation, UseMutationOptions } from '@tanstack/react-query'

import { api } from 'api/api'
import { IdentificationSessionResponse } from 'api/gen'
import { REDIRECT_URL_UBBLE } from 'features/identityCheck/constants'
import { MutationKeys } from 'libs/queryKeys'

export const useUbbleIdentificationMutation = (
  options?: UseMutationOptions<IdentificationSessionResponse, Error>
) =>
  useMutation({
    mutationKey: [MutationKeys.IDENTIFICATION_URL],
    mutationFn: () => api.postNativeV1UbbleIdentification({ redirectUrl: REDIRECT_URL_UBBLE }),
    ...options,
  })
