import { SearchResponse } from 'instantsearch.js'
import { useQuery } from 'react-query'

import { getGtlPlaylistsParams } from 'features/gtlPlaylist/gtlPlaylistHelpers'
import { UseGetOffersByGtlQueryArgs } from 'features/gtlPlaylist/types'
import { fetchOffersByGTL } from 'libs/algolia/fetchAlgolia/fetchOffersByGTL'
import { Offer } from 'shared/offer/types'

const STALE_TIME_GET_OFFERS_BY_GTL = 5 * 60 * 1000

export const useGetOffersByGtlQuery = <TData = SearchResponse<Offer[]>>(
  {
    filteredGtlPlaylistsConfig,
    venue,
    searchIndex,
    userLocation,
    selectedLocationMode,
    isUserUnderage,
    adaptPlaylistParameters,
    queryKey,
  }: UseGetOffersByGtlQueryArgs,
  select?: (data: SearchResponse<Offer>[]) => TData
) => {
  return useQuery<SearchResponse<Offer>[], Error, TData>({
    queryKey: [queryKey, venue?.id, userLocation, selectedLocationMode],
    queryFn: () =>
      fetchOffersByGTL({
        parameters: getGtlPlaylistsParams(
          filteredGtlPlaylistsConfig,
          venue,
          adaptPlaylistParameters
        ),
        buildLocationParameterParams: {
          userLocation,
          selectedLocationMode,
          aroundMeRadius: 'all',
          aroundPlaceRadius: 'all',
        },
        isUserUnderage,
        searchIndex,
      }),
    staleTime: STALE_TIME_GET_OFFERS_BY_GTL,
    select,
    enabled: !!filteredGtlPlaylistsConfig.length,
  })
}
