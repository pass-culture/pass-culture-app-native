import { useBookings } from 'features/bookings/api'

export const useBookingsEligibleToReactions = () => {
  const { data: bookings } = useBookings()

  return (
    bookings?.ended_bookings?.filter(
      (booking) => booking.enablePopUpReaction && !booking.userReaction
    ) ?? []
  )
}
