import { VenueResponse } from 'api/gen'
import { useGetGTLPlaylistConfigByLabelQuery } from 'features/gtlPlaylist/queries/useGetGTLPlaylistConfigQuery'
import { useGetFormattedAndFilteredOffersByGtl } from 'features/gtlPlaylist/queries/useGetOffersByGtlQuery'
import { OffersModuleParameters } from 'features/home/types'
import { AlgoliaOffer, HitOffer, PlaylistOffersParams } from 'libs/algolia/types'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { Position } from 'libs/location'
import { LocationMode } from 'libs/location/types'

type UseGTLPlaylistsProps = {
  venue?: VenueResponse
  searchIndex?: string
  searchGroupLabel?: ContentfulLabelCategories
  userLocation: Position
  selectedLocationMode: LocationMode
  isUserUnderage: boolean
  adaptPlaylistParameters: (parameters: OffersModuleParameters) => PlaylistOffersParams
  transformHits: (hit: AlgoliaOffer<HitOffer>) => AlgoliaOffer<HitOffer>
}

// TODO(PC-35123): refactor this hook
export const useGTLPlaylists = ({
  venue,
  searchIndex,
  searchGroupLabel,
  userLocation,
  selectedLocationMode,
  isUserUnderage,
  adaptPlaylistParameters,
  transformHits,
}: UseGTLPlaylistsProps) => {
  const { data: gtlPlaylistsByLabel } = useGetGTLPlaylistConfigByLabelQuery(
    searchGroupLabel,
    venue?.venueTypeCode
  )

  return useGetFormattedAndFilteredOffersByGtl(
    {
      filteredGtlPlaylistsConfig: gtlPlaylistsByLabel || [],
      venue,
      searchIndex,
      userLocation,
      selectedLocationMode,
      isUserUnderage,
      adaptPlaylistParameters,
    },
    transformHits
  )
}
