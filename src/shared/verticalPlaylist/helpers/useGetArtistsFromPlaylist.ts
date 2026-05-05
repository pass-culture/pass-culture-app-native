import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { selectSearchArtists } from 'features/search/queries/useSearchArtists/selectors/selectSearchArtists'
import { useSearchArtistsQuery } from 'features/search/queries/useSearchArtists/useSearchArtistsQuery'
import { getVenueOffersArtists } from 'features/venue/helpers/getVenueOffersArtists'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'
import { useVenueQuery } from 'features/venue/queries/useVenueQuery'
import { Artist } from 'features/venue/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useLocation } from 'libs/location/LocationWrapper'
import { useVenueOffersQuery } from 'queries/venue/useVenueOffersQuery'
import { VerticalPlaylistArtistsData } from 'shared/verticalPlaylist/types'

const NO_ARTISTS: Artist[] = []

export const useGetArtistsFromPlaylist = ({ params }): VerticalPlaylistArtistsData => {
  const { title, subtitle, venueId } = params
  const isVenue = !!venueId

  const { searchState } = useSearch()

  const { userLocation, selectedLocationMode, aroundPlaceRadius, aroundMeRadius, geolocPosition } =
    useLocation()

  const { disabilities } = useAccessibilityFiltersContext()

  const isUserUnderage = useIsUserUnderage()

  const { data: remoteConfig } = useRemoteConfigQuery()

  const queryParams = {
    parameters: { page: 0, ...searchState },
    buildLocationParameterParams: {
      userLocation,
      selectedLocationMode,
      aroundPlaceRadius,
      aroundMeRadius,
      geolocPosition,
    },
    aroundPrecision: remoteConfig.aroundPrecision,
    disabilitiesProperties: disabilities,
    isUserUnderage,
  }

  const { data: venue } = useVenueQuery(venueId, { enabled: isVenue })

  const venueSearchParams = useVenueSearchParameters(venue)
  const { data: venueOffers } = useVenueOffersQuery({
    venue: isVenue ? venue : undefined,
    userLocation,
    selectedLocationMode,
    isUserUnderage,
    venueSearchParams,
    searchState: venueSearchParams,
    transformHits: (hit) => hit,
  })

  const venueOffersHits = venueOffers?.hits
  const artistsFromRemoteConfig = remoteConfig.artistPageSubcategories.subcategories
  const { data: venueArtists } = venueId
    ? getVenueOffersArtists(artistsFromRemoteConfig, venueOffersHits)
    : { data: { artists: [] } }

  const query = useSearchArtistsQuery(queryParams, {
    enabled: !venueId,
    select: (data) => selectSearchArtists(data),
  })

  const artistsFromVenue = venueArtists?.artists
  const searchArtistsList = query.data
  const items = venueId ? (artistsFromVenue ?? NO_ARTISTS) : (searchArtistsList ?? NO_ARTISTS)
  const nbItems = items.length

  return {
    items,
    title,
    subtitle,
    nbItems,
  }
}
