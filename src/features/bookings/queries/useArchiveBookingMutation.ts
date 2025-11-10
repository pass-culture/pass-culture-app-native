import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

interface ArchiveBookingMutationOptions {
  bookingId: number
  onSuccess: () => void
  onError: (error: unknown) => void
}

export const useArchiveBookingMutation = ({
  bookingId,
  onSuccess,
  onError,
}: ArchiveBookingMutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.postNativeV1BookingsbookingIdToggleDisplay({ ended: true }, bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.BOOKINGS],
      })
      onSuccess()
    },
    onError,
  })
}
