import _ from 'lodash'
import { UseQueryResult } from 'react-query'

import { VenueResponse } from 'api/gen'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { isArtistPageCompatible } from 'features/venue/helpers/isArtistPageCompatible/isArtistPageCompatible'
import { Artist, VenueOffersArtists } from 'features/venue/types'

export const useVenueOffersArtists = (
  venue?: VenueResponse
): Partial<UseQueryResult<VenueOffersArtists>> => {
  const { data: venueOffers } = useVenueOffers(venue)

  if (!venueOffers) {
    return { data: { artists: [] } }
  }

  const artists: Artist[] = _.chain(
    // `flatMap` is used to map over `venueOffers.hits`, transforming each offer into an artist object if the artist exists,
    // and flattening the results into a single array. If no artist is found, it returns an empty array, effectively filtering out
    // offers without an artist in a single step.
    venueOffers.hits.flatMap((offer) =>
      offer.offer.artist && isArtistPageCompatible(offer.offer.artist, offer.offer.subcategoryId)
        ? [
            {
              id: Number(offer.objectID),
              name: offer.offer.artist,
              image: offer.offer.thumbUrl,
            },
          ]
        : []
    )
  )
    .groupBy('name')
    .orderBy(
      [(artistList) => artistList.length, (artistList) => artistList[0]?.name],
      ['desc', 'asc']
    )
    .flatten()
    .uniqBy('name')
    .slice(0, 30)
    .value()

  return {
    data: { artists },
  }
}
