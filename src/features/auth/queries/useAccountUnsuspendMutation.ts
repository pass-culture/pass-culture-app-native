import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export function useAccountUnsuspendMutation(
  onSuccess: () => void,
  onError: (error: unknown) => void
) {
  const queryClient = useQueryClient()

  return useMutation(() => api.postNativeV1AccountUnsuspend(), {
    onSuccess: () => {
      queriesToInvalidateOnUnsuspend.forEach((queryKey) =>
        queryClient.invalidateQueries([queryKey])
      )
      onSuccess()
    },
    onError,
  })
}

const queriesToInvalidateOnUnsuspend: QueryKeys[] = [
  QueryKeys.USER_PROFILE,
  QueryKeys.NEXT_SUBSCRIPTION_STEP,
  QueryKeys.FAVORITES,
  QueryKeys.FAVORITES_COUNT,
  QueryKeys.BOOKINGS,
]
