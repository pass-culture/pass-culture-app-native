import { uniqBy } from 'lodash'

import { FetchSearchArtistsResponse } from 'features/search/queries/useSearchArtists/types'
import { Artist } from 'features/venue/types'

export const selectSearchArtists = (data: FetchSearchArtistsResponse): Artist[] =>
  uniqBy(
    data.offerArtistsResponse.hits
      .filter((offer) => offer.artists?.length)
      .flatMap((offer) => offer.artists ?? []),
    (artist) => artist.id
  )
