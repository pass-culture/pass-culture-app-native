import { useQuery, UseQueryResult } from 'react-query'

import { api } from 'api/api'
import { BookingReponse, BookingsResponse } from 'api/gen'
import { useNetwork } from 'libs/network/useNetwork'
import { QueryKeys } from 'libs/queryKeys'

export function useBookings(options = {}) {
  const { isConnected, networkInfo } = useNetwork()
  console.log(`use Bookings hook ${isConnected}`, networkInfo)

  return useQuery<BookingsResponse>(
    QueryKeys.BOOKINGS,
    () => {
      return api.getnativev1bookings().then((res) => {
        console.log('we GOT new res', res)
        return res
      })
    },
    {
      enabled: isConnected,
      ...options,
    }
  )
}

export function useOngoingOrEndedBooking(
  id: number,
  options = {}
): UseQueryResult<BookingReponse | null> {
  return useBookings({
    ...options,
    onError(error: Error) {
      console.log('selected booking error', error)
    },
    onSuccess(data: BookingsResponse | null) {
      console.log('selected booking success', data)
    },
    select(bookings: BookingsResponse | null) {
      console.log('selecting booking from:', bookings)
      if (!bookings) {
        return null
      }
      const onGoingBooking = bookings.ongoing_bookings?.find(
        (item: BookingReponse) => item.id === id
      )
      const endedBooking = bookings.ended_bookings?.find((item: BookingReponse) => item.id === id)

      const selected = onGoingBooking || endedBooking
      console.log(`selecting booking ${id} was ${selected ? 'found' : 'not found'}:`, selected)

      if (!selected) {
        return null
      }
      return selected
    },
  }) as UseQueryResult<BookingReponse | null>
}
