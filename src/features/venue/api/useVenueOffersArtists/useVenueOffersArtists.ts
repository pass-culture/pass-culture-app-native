import { uniqBy } from 'lodash'
import { UseQueryResult } from 'react-query'

import { VenueResponse } from 'api/gen'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { Artist, VenueOffersArtists } from 'features/venue/types'

export const useVenueOffersArtists = (
  venue?: VenueResponse
): Partial<UseQueryResult<VenueOffersArtists>> => {
  const { data: venueOffers } = useVenueOffers(venue)

  if (!venueOffers) {
    return { data: { artists: [] } }
  }

  // `flatMap` is used to map over `venueOffers.hits`, transforming each offer into an artist object if the artist exists,
  // and flattening the results into a single array. If no artist is found, it returns an empty array, effectively filtering out
  // offers without an artist in a single step.
  const artists: Artist[] = uniqBy(
    venueOffers.hits.flatMap((offer) =>
      offer.offer.artist
        ? [
            {
              id: Number(offer.objectID),
              name: offer.offer.artist,
              image: offer.offer.thumbUrl,
            },
          ]
        : []
    ),
    'name'
  ).slice(0, 30)

  return {
    data: { artists },
  }
}
