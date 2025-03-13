import { useQuery } from 'react-query'

import { VenueResponse } from 'api/gen'
import { fetchGTLPlaylistConfig } from 'features/gtlPlaylist/api/fetchGTLPlaylistConfig'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { fetchOffersByGTL } from 'libs/algolia/fetchAlgolia/fetchOffersByGTL'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useLocation } from 'libs/location'
import { QueryKeys } from 'libs/queryKeys'

type UseGTLPlaylistsProps = {
  venue?: VenueResponse
  searchIndex?: string
}

// TODO(PC-35123): refactor this hook
export function useGTLPlaylists({ venue, searchIndex }: UseGTLPlaylistsProps) {
  const { userLocation, selectedLocationMode } = useLocation()
  const isUserUnderage = useIsUserUnderage()
  const adaptPlaylistParameters = useAdaptOffersPlaylistParameters()
  const transformHits = useTransformOfferHits()

  const { data: gtlPlaylists, isLoading } = useQuery({
    queryKey: [QueryKeys.GTL_PLAYLISTS, venue?.id, userLocation, selectedLocationMode],
    queryFn: async (): Promise<GtlPlaylistData[]> => {
      const gtlPlaylistsConfig = await fetchGTLPlaylistConfig()
      const offers = await fetchOffersByGTL(
        gtlPlaylistsConfig.map((request) => {
          const params = adaptPlaylistParameters(request.offersModuleParameters)
          return venue
            ? {
                ...params,
                offerParams: {
                  ...params.offerParams,
                  venue: {
                    venueId: venue.id,
                    info: venue.city ?? '',
                    label: venue.name,
                  },
                },
              }
            : params
        }),
        {
          userLocation,
          selectedLocationMode,
          aroundMeRadius: 'all',
          aroundPlaceRadius: 'all',
        },
        isUserUnderage,
        searchIndex
      )

      return gtlPlaylistsConfig.map((item, index) => {
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
