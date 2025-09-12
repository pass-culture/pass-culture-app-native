import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { UserProfilePatchRequest } from 'api/gen'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { QueryKeys } from 'libs/queryKeys'

type Options = {
  onSuccess?: (data: UserProfileResponseWithoutSurvey, body: UserProfilePatchRequest) => void
  onError?: (error: unknown) => void
}

export const usePatchProfileMutation = ({ onError, onSuccess }: Options) => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: UserProfilePatchRequest) => api.patchNativeV1Profile(body),
    onSuccess(response: UserProfileResponseWithoutSurvey, variables) {
      client.setQueryData(
        [QueryKeys.USER_PROFILE],
        (old: UserProfileResponseWithoutSurvey | undefined) => ({
          ...(old ?? {}),
          ...response,
        })
      )
      onSuccess?.(response, variables)
    },
    onError,
  })
}
