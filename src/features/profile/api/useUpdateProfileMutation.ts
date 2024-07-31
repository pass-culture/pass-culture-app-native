import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { UserProfileResponse, UserProfilePatchRequest } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export function useUpdateProfileMutation(
  onSuccessCallback: (data: UserProfileResponse) => void,
  onErrorCallback: (error: unknown) => void
) {
  const client = useQueryClient()
  return useMutation((body: UserProfilePatchRequest) => api.patchNativeV1Profile(body), {
    onSuccess(response: UserProfileResponse) {
      client.setQueryData([QueryKeys.USER_PROFILE], (old: UserProfileResponse | undefined) => ({
        ...(old ?? {}),
        ...response,
      }))
      onSuccessCallback(response)
    },
    onError: onErrorCallback,
  })
}
