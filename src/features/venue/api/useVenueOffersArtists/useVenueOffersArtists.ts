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

  const artists: Artist[] = uniqBy(
    venueOffers.hits
      .map((offer) => {
        if (!offer.offer.artist) return null

        const artist: Artist = {
          id: Number(offer.objectID),
          name: offer.offer.artist,
          imageUrl: offer.offer.thumbUrl,
        }

        return artist
      })
      .filter((item): item is Artist => item !== null),
    'name'
  ).slice(0, 30)

  return {
    data: { artists },
  }
}
