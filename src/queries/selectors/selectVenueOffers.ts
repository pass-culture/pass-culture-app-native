import { uniqBy } from 'lodash'

import type { VenueOffers } from 'features/venue/types'
import {
  filterOfferHitWithImage,
  filterValidOfferHit,
  sortHitOffersByDate,
  determineAllOffersAreEventsAndNotCinema,
} from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaOffer, HitOffer, MultipleVenueOffersResult } from 'libs/algolia/types'
import { SubcategoriesMapping } from 'libs/subcategories/types'
type Props = {
  venueOffers: MultipleVenueOffersResult
  transformHits: (hit: AlgoliaOffer<HitOffer>) => AlgoliaOffer<HitOffer>
  includeHitsWithoutImage?: boolean
  mapping?: SubcategoriesMapping
}

export const selectVenueOffers = ({
  venueOffers,
  transformHits,
  includeHitsWithoutImage,
  mapping,
}: Props): VenueOffers => {
  const [venueSearchedOffersResults, venueTopOffersResults, headlineOfferResults] = venueOffers
  const filterFn = includeHitsWithoutImage ? filterValidOfferHit : filterOfferHitWithImage
  const hits = [venueSearchedOffersResults, venueTopOffersResults]
    .flatMap((result) => result?.hits ?? [])
    .filter(filterFn)
    .map(transformHits)

  const uniqHits = uniqBy(hits, 'objectID')

  if (determineAllOffersAreEventsAndNotCinema(hits, mapping)) uniqHits.sort(sortHitOffersByDate)

  const headlineOffer = headlineOfferResults?.hits[0]
    ? transformHits(headlineOfferResults?.hits[0])
    : undefined

  return {
    hits: uniqHits,
    nbHits: uniqHits.length,
    headlineOffer,
  }
}
