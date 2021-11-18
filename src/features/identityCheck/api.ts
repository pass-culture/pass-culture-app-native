import { useMutation, UseMutationOptions } from 'react-query'

import { api } from 'api/api'
import { IdentificationSessionResponse } from 'api/gen'
import { MutationKeys } from 'libs/queryKeys'

type Options = Partial<UseMutationOptions<IdentificationSessionResponse, void, string>>

export function useRequestIdentificationUrl(options?: Options) {
  return useMutation<IdentificationSessionResponse, void, string>(
    MutationKeys.IDENTIFICATION_URL,
    (redirectUrl: string) => api.postnativev1ubbleIdentification({ redirectUrl }),
    options
  )
}
