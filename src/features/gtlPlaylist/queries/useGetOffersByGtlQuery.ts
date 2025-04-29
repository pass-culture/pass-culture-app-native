import { SearchResponse } from 'instantsearch.js'
import { useQuery } from 'react-query'

import { VenueResponse } from 'api/gen'
import { getGtlPlaylistsParams } from 'features/gtlPlaylist/gtlPlaylistHelpers'
import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'
import { OffersModuleParameters } from 'features/home/types'
import { fetchOffersByGTL } from 'libs/algolia/fetchAlgolia/fetchOffersByGTL'
import { AlgoliaOffer, HitOffer, PlaylistOffersParams } from 'libs/algolia/types'
import { LocationMode, Position } from 'libs/location/types'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

type UseGetOffersByGtlQueryArgs = {
  filteredGtlPlaylistsConfig: GtlPlaylistRequest[]
  venue?: VenueResponse
  searchIndex?: string
  userLocation: Position
  selectedLocationMode: LocationMode
  isUserUnderage: boolean
  adaptPlaylistParameters: (parameters: OffersModuleParameters) => PlaylistOffersParams
}

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
  }: UseGetOffersByGtlQueryArgs,
  select?: (data: SearchResponse<Offer>[]) => TData
) =>
  useQuery<SearchResponse<Offer>[], Error, TData>({
    queryKey: [QueryKeys.GTL_PLAYLISTS],
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

export const useGetFormattedAndFilteredOffersByGtl = (
  args: UseGetOffersByGtlQueryArgs,
  transformHits: (hit: AlgoliaOffer<HitOffer>) => AlgoliaOffer<HitOffer>
) =>
  useGetOffersByGtlQuery(args, (data) =>
    args.filteredGtlPlaylistsConfig
      .map((item, index) => ({
        title: item.displayParameters.title,
        offers: { hits: data[index]?.hits.map(transformHits) ?? [] },
        layout: item.displayParameters.layout,
        minNumberOfOffers: item.displayParameters.minOffers,
        entryId: item.id,
      }))
      .filter(
        (playlist) => playlist?.offers?.hits.length >= Math.max(playlist.minNumberOfOffers, 1)
      )
  )
