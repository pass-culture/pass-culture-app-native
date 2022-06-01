import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export function useAccountUnsuspend(onSuccess: () => void, onError: (error: unknown) => void) {
  const queryClient = useQueryClient()

  return useMutation(() => api.postnativev1accountunsuspend(), {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.USER_PROFILE)
      queryClient.invalidateQueries(QueryKeys.NEXT_SUBSCRIPTION_STEP)
      onSuccess()
    },
    onError,
  })
}
