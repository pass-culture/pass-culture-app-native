import { useBooking } from './useBooking'
import { useBookingOffer } from './useBookingOffer'

export const useBookingStock = () => {
  const { bookingState } = useBooking()
  const offer = useBookingOffer()
  return offer ? offer.stocks.find(({ id }) => id === bookingState.stockId) : undefined
}
