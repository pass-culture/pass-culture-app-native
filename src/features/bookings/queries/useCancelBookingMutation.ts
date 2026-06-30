import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

interface Props {
  onSuccess: () => void
  onError: (error: unknown) => void
}

export const useCancelBookingMutation = ({ onSuccess, onError }: Props) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookingId: number) => api.postNativeV1BookingsbookingIdCancel(bookingId),
    onSuccess: async (_, bookingId) => {
      queryClient.removeQueries({ queryKey: [QueryKeys.BOOKINGSV2, bookingId] })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_PROFILE] }),
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.BOOKINGSV2],
          refetchType: 'all',
          exact: true,
        }),
        queryClient.invalidateQueries({ queryKey: [QueryKeys.BOOKINGSLIST] }),
      ])
      onSuccess()
    },
    onError,
  })
}
