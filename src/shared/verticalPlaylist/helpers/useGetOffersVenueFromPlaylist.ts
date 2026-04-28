import { SubcategoryIdEnum } from 'api/gen'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'
import { useVenueQuery } from 'features/venue/queries/useVenueQuery'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useLocation } from 'libs/location/location'
import { useVenueOffersQuery } from 'queries/venue/useVenueOffersQuery'
import { OffersVenue, VerticalPlaylistOffersData } from 'shared/verticalPlaylist/types'

export const useGetOffersVenueFromPlaylist = ({
  venueId,
  playlistTitle,
}: OffersVenue): VerticalPlaylistOffersData => {
  const { searchState } = useSearch()
  const { userLocation, selectedLocationMode } = useLocation()
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformOfferHits()
  const { data: venue } = useVenueQuery(venueId)
  const venueSearchParams = useVenueSearchParameters(venue)

  const offersQuery = useVenueOffersQuery({
    userLocation,
    selectedLocationMode,
    isUserUnderage,
    venueSearchParams,
    searchState,
    transformHits,
    venue,
  })

  const items = (offersQuery.data?.hits ?? []).filter(
    (offers) => offers.offer.subcategoryId !== SubcategoryIdEnum.SEANCE_CINE
  )

  return {
    items,
    title: playlistTitle,
    searchId: searchState.searchId,
    searchQuery: searchState.query,
  }
}
