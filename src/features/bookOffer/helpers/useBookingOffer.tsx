import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useOfferQuery } from 'queries/offer/useOfferQuery'

export const useBookingOffer = () => {
  const { bookingState } = useBookingContext()
  const { data: offer } = useOfferQuery({ offerId: bookingState.offerId as number })
  return offer
}
