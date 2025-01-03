import _ from 'lodash'
import { UseQueryResult } from 'react-query'

import { VenueResponse } from 'api/gen'
import { COMMA_OR_SEMICOLON_REGEX, EXCLUDED_ARTISTS } from 'features/offer/helpers/constants'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { Artist, VenueOffersArtists } from 'features/venue/types'

export const useVenueOffersArtists = (
  venue?: VenueResponse
): Partial<UseQueryResult<VenueOffersArtists>> => {
  const { data: venueOffers } = useVenueOffers(venue)

  if (!venueOffers) {
    return { data: { artists: [] } }
  }

  const artists: Artist[] = _.chain(
    venueOffers.hits.map((offer) =>
      offer.offer.artist
        ? {
            id: Number(offer.objectID),
            name: offer.offer.artist,
            image: offer.offer.thumbUrl,
          }
        : <Artist>{}
    )
  )
    .groupBy('name')
    .pickBy((artistList) => artistList.length > 1)
    .orderBy(
      [(artistList) => artistList.length, (artistList) => artistList[0]?.name],
      ['desc', 'asc']
    )
    .flatten()
    .uniqBy('name')
    .filter(
      (artist) =>
        !COMMA_OR_SEMICOLON_REGEX.test(artist.name) &&
        !EXCLUDED_ARTISTS.includes(artist.name?.toLowerCase())
    )
    .slice(0, 30)
    .value()

  return {
    data: { artists },
  }
}
