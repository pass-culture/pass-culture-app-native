import { useMemo } from 'react'

import { useBookings } from 'features/bookings/api'

export function useIsBookableOffer(id: number): boolean {
  const { data } = useBookings()

  return useMemo(() => {
    if (data) {
      const bookings = [
        ...(data?.ended_bookings ? data?.ended_bookings : []),
        ...(data?.ongoing_bookings ? data?.ongoing_bookings : []),
      ].filter((booking) => booking.stock.offer.id === id && !booking.cancellationDate)
      return bookings.length === 0
    }
    return true
  }, [data, id])
}
