import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
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

export function useBookOfferMutation({ onSuccess, onError }: BookOffer) {
  const queryClient = useQueryClient()

  return useMutation((body: BookOfferRequest) => api.postnativev1bookings(body), {
    onSuccess: (data: BookOfferResponse) => {
      queryClient.invalidateQueries(QueryKeys.USER_PROFILE)
      queryClient.invalidateQueries(QueryKeys.BOOKINGS)
      onSuccess(data)
    },
    onError: (error: Error | ApiError, { stockId, quantity }, context?: BookingMutationContext) => {
      if (context?.previousBookings) {
        queryClient.setQueryData(QueryKeys.BOOKINGS, context.previousBookings)
      }
      onError(error, { stockId, quantity }, context)
    },
  })
}
