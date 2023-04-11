import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export function useAccountUnsuspend(onSuccess: () => void, onError: (error: unknown) => void) {
  const queryClient = useQueryClient()

  return useMutation(() => api.postnativev1accountunsuspend(), {
    onSuccess: () => {
      queriesToInvalidateOnUnsuspend.forEach((queryKey) =>
        queryClient.invalidateQueries([queryKey])
      )
      onSuccess()
    },
    onError,
  })
}

export const queriesToInvalidateOnUnsuspend: QueryKeys[] = [
  QueryKeys.USER_PROFILE,
  QueryKeys.NEXT_SUBSCRIPTION_STEP,
  QueryKeys.FAVORITES,
  QueryKeys.FAVORITES_COUNT,
  QueryKeys.BOOKINGS,
]
