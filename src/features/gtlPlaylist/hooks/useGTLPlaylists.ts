import { useQuery } from 'react-query'

import { VenueResponse } from 'api/gen'
import { fetchGTLPlaylistConfig } from 'features/gtlPlaylist/api/fetchGTLPlaylistConfig'
import {
  filterGtlPlaylistConfigByLabel,
  getGtlPlaylistsParams,
} from 'features/gtlPlaylist/gtlPlaylistHelpers'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { getShouldDisplayGtlPlaylist } from 'features/venue/pages/Venue/getShouldDisplayGtlPlaylist'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { fetchOffersByGTL } from 'libs/algolia/fetchAlgolia/fetchOffersByGTL'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { useLocation } from 'libs/location'
import { QueryKeys } from 'libs/queryKeys'

type UseGTLPlaylistsProps = {
  venue?: VenueResponse
  searchIndex?: string
  searchGroupLabel?: ContentfulLabelCategories
}

// TODO(PC-35123): refactor this hook
export function useGTLPlaylists({ venue, searchIndex, searchGroupLabel }: UseGTLPlaylistsProps) {
  const { userLocation, selectedLocationMode } = useLocation()
  const isUserUnderage = useIsUserUnderage()
  const adaptPlaylistParameters = useAdaptOffersPlaylistParameters()
  const transformHits = useTransformOfferHits()

  const { data: gtlPlaylists, isLoading } = useQuery({
    queryKey: [
      QueryKeys.GTL_PLAYLISTS,
      venue?.id,
      userLocation,
      selectedLocationMode,
      searchGroupLabel,
    ],
    queryFn: async (): Promise<GtlPlaylistData[]> => {
      const gtlPlaylistsConfig = await fetchGTLPlaylistConfig()
      if (
        venue &&
        !searchGroupLabel &&
        !getShouldDisplayGtlPlaylist({ venueType: venue?.venueTypeCode })
      ) {
        return Promise.resolve([])
      }

      const filteredGtlPlaylistsConfig = filterGtlPlaylistConfigByLabel(
        gtlPlaylistsConfig,
        venue?.venueTypeCode,
        searchGroupLabel
      )

      const offers = await fetchOffersByGTL({
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
      })

      return filteredGtlPlaylistsConfig.map((item, index) => {
        return {
          title: item.displayParameters.title,
          offers: { hits: offers[index]?.hits.map(transformHits) ?? [] },
          layout: item.displayParameters.layout,
          minNumberOfOffers: item.displayParameters.minOffers,
          entryId: item.id,
        }
      })
    },
    staleTime: 5 * 60 * 1000, // 5 minutes, as the GTL playlists are not often updated
  })

  if (!gtlPlaylists) {
    return { gtlPlaylists: [], isLoading }
  }

  return {
    gtlPlaylists: gtlPlaylists.filter(
      (playlist) => playlist?.offers?.hits.length >= Math.max(playlist.minNumberOfOffers, 1)
    ),
    isLoading,
  }
}
