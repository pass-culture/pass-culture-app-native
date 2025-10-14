import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { convertOfferDatesToTimezone } from 'queries/offer/selectors/convertOfferDatesToTimezone'
import { useOfferQuery } from 'queries/offer/useOfferQuery'

export const useBookingOfferQuery = () => {
  const { bookingState } = useBookingContext()
  const { data: offer } = useOfferQuery({
    offerId: bookingState.offerId as number,
    select: convertOfferDatesToTimezone,
  })
  return offer
}
