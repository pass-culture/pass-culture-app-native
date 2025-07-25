import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

interface Props {
  onSuccess: () => void
  onError: (error: unknown) => void
}

export const useCancelBookingMutation = ({ onSuccess, onError }: Props) => {
  const queryClient = useQueryClient()

  return useMutation((bookingId: number) => api.postNativeV1BookingsbookingIdCancel(bookingId), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.USER_PROFILE])
      queryClient.invalidateQueries([QueryKeys.BOOKINGS])
      onSuccess()
    },
    onError,
  })
}
