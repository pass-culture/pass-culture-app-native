import { useOffer } from 'features/offer/api/useOffer'

import { useBooking } from './useBooking'

export const useBookingOffer = () => {
  const { bookingState } = useBooking()
  const { data: offer } = useOffer({ offerId: bookingState.offerId as number })
  return offer
}
