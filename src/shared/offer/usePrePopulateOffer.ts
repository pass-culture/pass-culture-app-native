import { useQueryClient } from 'react-query'

import { ExpenseDomain, OfferResponse, OfferStockResponse, OfferVenueResponse } from 'api/gen'
import { OfferTileProps } from 'features/offer/types'
import { QueryKeys } from 'libs/queryKeys'

type PartialOffer = Pick<
  OfferTileProps,
  'categoryId' | 'thumbUrl' | 'isDuo' | 'name' | 'offerId' | 'subcategoryId'
>

// Here we do optimistic rendering: we suppose that if the offer is available
// as a search result, by the time the user clicks on it, the offer is still
// available, released, not sold out...
const mergeOfferData =
  (offer: PartialOffer) =>
  (prevData: OfferResponse | undefined): OfferResponse => ({
    description: '',
    image: offer.thumbUrl ? { url: offer.thumbUrl } : undefined,
    isDuo: offer.isDuo ?? false,
    name: offer.name ?? '',
    isDigital: false,
    isExpired: false,
    // assumption. If wrong, we receive correct data once API call finishes.
    // In the meantime, we have to make sure no visual glitch appears.
    // For example, before displaying the CTA, we wait for the API call to finish.
    isEducational: false,
    isReleased: true,
    isSoldOut: false,
    isForbiddenToUnderage: false,
    id: offer.offerId,
    stocks: [] as Array<OfferStockResponse>,
    expenseDomains: [] as Array<ExpenseDomain>,
    accessibility: {},
    subcategoryId: offer.subcategoryId,
    venue: { coordinates: {} } as OfferVenueResponse,
    metadata: prevData?.metadata,
    ...(prevData ?? {}),
  })

export const usePrePopulateOffer = () => {
  const queryClient = useQueryClient()

  const prePopulateOffer = (offer: PartialOffer) => {
    queryClient.setQueryData([QueryKeys.OFFER, offer.offerId], mergeOfferData(offer))
  }

  return prePopulateOffer
}
