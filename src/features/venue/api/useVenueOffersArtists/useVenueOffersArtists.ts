import { chain } from 'lodash'
import { UseQueryResult } from 'react-query'

import { VenueResponse } from 'api/gen'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { isArtistPageCompatible } from 'features/venue/helpers/isArtistPageCompatible/isArtistPageCompatible'
import { Artist, VenueOffersArtists } from 'features/venue/types'

// TODO(PC-33464): Code to delete if correctly managed on backend (to be replaced by a hook which get the artists from Algolia)
export const useVenueOffersArtists = (
  venue?: VenueResponse
): Partial<UseQueryResult<VenueOffersArtists>> => {
  const { data: venueOffers } = useVenueOffers(venue)

  if (!venueOffers) {
    return { data: { artists: [] } }
  }

  const artists: Artist[] = chain(
    // `flatMap` is used to map over `venueOffers.hits`, transforming each offer into an artists array if exists,
    // and flattening the results into a single array. If no artists found, it returns an empty array, effectively filtering out
    // offers without artists in a single step.
    venueOffers.hits.flatMap((offer) =>
      (offer.artists ?? []).filter((artist) =>
        isArtistPageCompatible(artist.name, offer.offer.subcategoryId)
      )
    )
  )
    .groupBy('id')
    .orderBy(
      [(artistList) => artistList.length, (artistList) => artistList[0]?.name],
      ['desc', 'asc']
    )
    .flatten()
    .uniqBy('id')
    .slice(0, 30)
    .value()

  return {
    data: { artists },
  }
}
