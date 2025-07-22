import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { BookingsResponse, BookOfferRequest, BookOfferResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

interface BookingMutationContext {
  previousBookings: Array<BookingsResponse>
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

  return useMutation((body: BookOfferRequest) => api.postNativeV1Bookings(body), {
    onSuccess: async (data: BookOfferResponse) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_PROFILE] })
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BOOKINGS] })
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BOOKINGSV2] })

      onSuccess(data)
    },
    onError: (error: Error | ApiError, { stockId, quantity }, context?: BookingMutationContext) => {
      if (context?.previousBookings) {
        queryClient.setQueryData([QueryKeys.BOOKINGS], context.previousBookings)
      }
      onError(error, { stockId, quantity }, context)
    },
  })
}
