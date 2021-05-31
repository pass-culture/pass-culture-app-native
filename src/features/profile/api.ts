import { useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query'

import { api } from 'api/api'
import {
  GetNextBeneficiaryValidationStep,
  UserProfileResponse,
  UserProfileUpdateRequest,
} from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export function useUpdateProfileMutation(
  onSuccessCallback: (data: UserProfileResponse) => void,
  onErrorCallback: (error: unknown) => void
) {
  const client = useQueryClient()
  return useMutation((body: UserProfileUpdateRequest) => api.postnativev1profile(body), {
    onSuccess(response: UserProfileResponse) {
      const old = client.getQueryState<UserProfileResponse>('userProfile')?.data || {}
      client.setQueryData('userProfile', { ...old, ...response })
      onSuccessCallback(response)
    },
    onError: onErrorCallback,
  })
}

export function useNextBeneficiaryValidationStep(
  options?: UseQueryOptions<GetNextBeneficiaryValidationStep>
) {
  return useQuery<GetNextBeneficiaryValidationStep>(
    QueryKeys.NEXT_BENEFICIARY_VALIDATION_STEP,
    () => api.getnativev1accountnextBeneficiaryValidationStep(),
    options
  )
}
