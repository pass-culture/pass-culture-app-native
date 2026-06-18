import { useMutation, UseMutationOptions } from '@tanstack/react-query'

import { api } from 'api/api'
import { IdentificationSessionResponse } from 'api/gen'
import { REDIRECT_URL_UBBLE } from 'features/identityCheck/constants'

export const useUbbleIdentificationMutation = (
  options?: UseMutationOptions<IdentificationSessionResponse, Error>
) =>
  useMutation({
    mutationFn: () => api.postNativeV1UbbleIdentification({ redirectUrl: REDIRECT_URL_UBBLE }),
    ...options,
  })
