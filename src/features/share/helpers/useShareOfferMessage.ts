import { useOffer } from 'features/offer/api/useOffer'
import { getOfferLocationName } from 'shared/offer/getOfferLocationName'

export const useShareOfferMessage = (offerId: number): string | undefined => {
  const { data: offer } = useOffer({ offerId })

  if (!offer) return

  const locationName = getOfferLocationName(offer.venue, offer.isDigital)
  return `Retrouve "${offer.name}" chez "${locationName}" sur le pass Culture`
}
