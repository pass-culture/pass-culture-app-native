import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'

export const useBookingStock = () => {
  const { bookingState } = useBookingContext()
  const offer = useBookingOffer()
  return offer ? offer.stocks.find(({ id }) => id === bookingState.stockId) : undefined
}
