import { chain } from 'lodash'
import { UseQueryResult } from 'react-query'

import { SubcategoryIdEnum } from 'api/gen'
import { Artist, VenueOffersArtists } from 'features/venue/types'
import { Offer } from 'shared/offer/types'

export const getVenueOffersArtists = (
  artistPageSubcategories: SubcategoryIdEnum[],
  venueOffers?: Offer[]
): Partial<UseQueryResult<VenueOffersArtists>> => {
  if (!venueOffers) {
    return { data: { artists: [] } }
  }

  const artists: Artist[] = chain(
    // `flatMap` is used to map over `venueOffers`, transforming each offer into an artists array if exists,
    // and flattening the results into a single array. If no artists found, it returns an empty array, effectively filtering out
    // offers without artists in a single step.
    venueOffers.flatMap((offer) => {
      if (artistPageSubcategories.includes(offer.offer.subcategoryId) && offer.artists) {
        return offer.artists
      }
      return []
    })
  )
    .groupBy((artist) => artist.name.trim().toLowerCase())
    .orderBy(
      [(artistList) => artistList.length, (artistList) => artistList[0]?.name],
      ['desc', 'asc']
    )
    .flatten()
    .uniqBy((artist) => artist.name.trim().toLowerCase())
    .slice(0, 30)
    .value()

  return {
    data: { artists },
  }
}
