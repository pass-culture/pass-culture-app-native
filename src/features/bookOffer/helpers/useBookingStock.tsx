import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useBookingOfferQuery } from 'queries/offer/useBookingOfferQuery'

export const useBookingStock = () => {
  const { bookingState } = useBookingContext()
  const offer = useBookingOfferQuery()
  return offer ? offer.stocks.find(({ id }) => id === bookingState.stockId) : undefined
}
