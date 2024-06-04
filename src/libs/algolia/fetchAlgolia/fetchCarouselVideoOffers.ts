import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { OfferModuleQuery } from 'libs/algolia/types'
import { Offer } from 'shared/offer/types'

export const fetchCarouselVideoOffers = async (queries: OfferModuleQuery[]) => {
  return multipleQueries<Offer>(queries)
}
