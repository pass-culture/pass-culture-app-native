import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { BookingsResponse, BookOfferRequest, BookOfferResponse } from 'api/gen'
import { eventMonitoring } from 'libs/monitoring'
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
    onSuccess: async (data: BookOfferResponse) => {
      queryClient.invalidateQueries([QueryKeys.USER_PROFILE])

      try {
        // NOTE: In react-query, to force refetch, invalidateQueries is not reliable, staleTime is not reliable, and underlying function such as refetch are not.
        // TODO(kopax): dig why and take actions
        const bookings: BookingsResponse = await api.getnativev1bookings()
        queryClient.setQueryData([QueryKeys.BOOKINGS], bookings)
      } catch (error) {
        eventMonitoring.captureException(error, {
          extra: {
            bookingId: data.bookingId,
          },
        })
      }

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
