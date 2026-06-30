import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { BookingsResponseV2, BookOfferRequest, BookOfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { Adjust } from 'libs/adjust/adjust'
import { AdjustEvents } from 'libs/adjust/adjustEvents'
import { QueryKeys } from 'libs/queryKeys'
import { prefetchBookingByIdQuery } from 'queries/bookings/useBookingByIdQuery'
import { prefetchBookingsV2Query } from 'queries/bookings/useBookingsQuery'

interface BookingMutationContext {
  previousBookings: Array<BookingsResponseV2>
}

interface BookOffer {
  onSuccess: (data: BookOfferResponse) => void
  onError: (
    error: Error | ApiError | undefined,
    { stockId, quantity }: { stockId?: number; quantity?: number },
    context?: BookingMutationContext
  ) => void
}

export const useBookOfferMutation = ({ onSuccess, onError }: BookOffer) => {
  const queryClient = useQueryClient()
  const { isLoggedIn } = useAuthContext()

  return useMutation({
    mutationFn: (body: BookOfferRequest) => api.postNativeV1Bookings(body),
    onSuccess: async (data: BookOfferResponse) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_PROFILE] }),
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.BOOKINGSV2],
          refetchType: 'all',
          exact: true,
        }),
        queryClient.invalidateQueries({ queryKey: [QueryKeys.BOOKINGSLIST] }),
      ])

      await Promise.all([
        prefetchBookingByIdQuery(data.bookingId, isLoggedIn),
        prefetchBookingsV2Query(isLoggedIn),
      ])

      Adjust.logEvent(AdjustEvents.BOOK_OFFER)
      onSuccess(data)
    },
    onError: (error: Error | ApiError, { stockId, quantity }, context?: BookingMutationContext) => {
      if (context?.previousBookings) {
        queryClient.setQueryData([QueryKeys.BOOKINGSV2], context.previousBookings)
      }
      onError(error, { stockId, quantity }, context)
    },
  })
}
