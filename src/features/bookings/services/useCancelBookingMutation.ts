import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'

interface Props {
  onSuccess: () => void
  onError: (error: unknown) => void
}

export const useCancelBookingMutation = ({ onSuccess, onError }: Props) => {
  const queryClient = useQueryClient()

  return useMutation((bookingId: number) => api.postnativev1bookingsbookingIdcancel(bookingId), {
    onSuccess: () => {
      queryClient.invalidateQueries('me')
      queryClient.invalidateQueries('bookings')
      onSuccess()
    },
    onError,
  })
}
