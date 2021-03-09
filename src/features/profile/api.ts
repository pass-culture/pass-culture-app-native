import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { UserProfileResponse, UserProfileUpdateRequest } from 'api/gen'

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
