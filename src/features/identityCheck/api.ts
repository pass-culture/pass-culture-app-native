import { useMutation, UseMutationOptions } from 'react-query'

import { api } from 'api/api'
import { IdentificationSessionResponse } from 'api/gen'
import { WEBAPP_V2_URL } from 'libs/environment'
import { MutationKeys } from 'libs/queryKeys'

type Options = Partial<UseMutationOptions<IdentificationSessionResponse, void>>

export const REDIRECT_URL_UBBLE = `${WEBAPP_V2_URL}/verification-identite/fin`

export function useRequestIdentificationUrl(options?: Options) {
  return useMutation<IdentificationSessionResponse, void>(
    MutationKeys.IDENTIFICATION_URL,
    () => api.postnativev1ubbleIdentification({ redirectUrl: REDIRECT_URL_UBBLE }),
    options
  )
}
