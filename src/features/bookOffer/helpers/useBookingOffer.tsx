import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useOffer } from 'features/offer/api/useOffer'

export const useBookingOffer = () => {
  const { bookingState } = useBookingContext()
  const { data: offer } = useOffer({ offerId: bookingState.offerId as number })
  return offer
}
