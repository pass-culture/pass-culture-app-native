import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { UserProfileResponse, UserProfilePatchRequest } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

type Options = {
  onSuccess?: (data: UserProfileResponse, body: UserProfilePatchRequest) => void
  onError?: (error: unknown) => void
}

export function usePatchProfileMutation({ onError, onSuccess }: Options) {
  const client = useQueryClient()
  return useMutation((body: UserProfilePatchRequest) => api.patchNativeV1Profile(body), {
    onSuccess(response: UserProfileResponse, variables) {
      client.setQueryData([QueryKeys.USER_PROFILE], (old: UserProfileResponse | undefined) => ({
        ...(old ?? {}),
        ...response,
      }))
      onSuccess?.(response, variables)
    },
    onError,
  })
}
