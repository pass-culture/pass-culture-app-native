import { useMutation, useQueryClient } from 'react-query'

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

  return useMutation(
    () => api.postNativeV1BookingsbookingIdToggleDisplay(bookingId, { ended: true }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.BOOKINGS])
        onSuccess()
      },
      onError,
    }
  )
}
