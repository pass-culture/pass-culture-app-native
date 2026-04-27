import { uniqBy } from 'lodash'

import { FetchSearchArtistsResponse } from 'features/search/queries/useSearchArtists/types'
import { SelectSearchOffersParams } from 'features/search/queries/useSearchOffersQuery/types'
import { Artist } from 'features/venue/types'

export const selectSearchArtists = (
  data: FetchSearchArtistsResponse,
  selectedFilter: SelectSearchOffersParams['selectedFilter']
): Artist[] => {
  const isArtistsFilterActive = selectedFilter === null || selectedFilter === 'Artistes'
  if (!isArtistsFilterActive) return []

  return uniqBy(
    data.offerArtistsResponse.hits
      .filter((offer) => offer.artists?.length)
      .flatMap((offer) => offer.artists ?? []),
    (artist) => artist.id
  )
}
