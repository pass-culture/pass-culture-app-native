import { VenueResponse } from 'api/gen'
import { useGetFormattedAndFilteredOffersByGtl } from 'features/gtlPlaylist/queries/useGetFormattedAndFilteredOffersByGtl'
import { useGetGTLPlaylistsConfigByLabelQuery } from 'features/gtlPlaylist/queries/useGetGTLPlaylistConfigByLabelQuery'
import { OffersModuleParameters } from 'features/home/types'
import { AlgoliaOffer, HitOffer, PlaylistOffersParams } from 'libs/algolia/types'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { Position } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { QueryKeys } from 'libs/queryKeys'

type UseGTLPlaylistsProps = {
  venue?: Omit<VenueResponse, 'isVirtual'>
  searchIndex?: string
  searchGroupLabel?: ContentfulLabelCategories
  userLocation: Position
  selectedLocationMode: LocationMode
  isUserUnderage: boolean
  adaptPlaylistParameters: (parameters: OffersModuleParameters) => PlaylistOffersParams
  transformHits: (hit: AlgoliaOffer<HitOffer>) => AlgoliaOffer<HitOffer>
  queryKey: keyof typeof QueryKeys
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
  queryKey,
}: UseGTLPlaylistsProps) => {
  const { data: filteredGtlPlaylistsConfig = [] } = useGetGTLPlaylistsConfigByLabelQuery(
    searchGroupLabel,
    venue?.activity
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
      queryKey,
    },
    transformHits
  )
}
