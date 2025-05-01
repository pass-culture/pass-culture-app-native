import { VenueResponse } from 'api/gen'
import { useGetFormattedAndFilteredOffersByGtl } from 'features/gtlPlaylist/queries/useGetFormattedAndFilteredOffersByGtl'
import { useGetGTLPlaylistsConfigByLabelQuery } from 'features/gtlPlaylist/queries/useGetGTLPlaylistConfigByLabelQuery'
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

export const useGTLPlaylistsQuery = ({
  venue,
  searchIndex,
  searchGroupLabel,
  userLocation,
  selectedLocationMode,
  isUserUnderage,
  adaptPlaylistParameters,
  transformHits,
}: UseGTLPlaylistsProps) => {
  const { data: filteredGtlPlaylistsConfig = [] } = useGetGTLPlaylistsConfigByLabelQuery(
    searchGroupLabel,
    venue?.venueTypeCode
  )

  return useGetFormattedAndFilteredOffersByGtl(
    {
      filteredGtlPlaylistsConfig,
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
