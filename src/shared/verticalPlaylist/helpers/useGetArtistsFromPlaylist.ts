import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { selectSearchArtists } from 'features/search/queries/useSearchArtists/selectors/selectSearchArtists'
import { useSearchArtistsQuery } from 'features/search/queries/useSearchArtists/useSearchArtistsQuery'
import { getVenueOffersArtists } from 'features/venue/helpers/getVenueOffersArtists'
import { Artist } from 'features/venue/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useLocation } from 'libs/location/LocationWrapper'
import { VerticalPlaylistArtistsData } from 'shared/verticalPlaylist/types'

const NO_ARTISTS: Artist[] = []

export const useGetArtistsFromPlaylist = ({ params }): VerticalPlaylistArtistsData => {
  const { title, subtitle } = params
  const { searchState } = useSearch()
  const { userLocation, selectedLocationMode, aroundPlaceRadius, aroundMeRadius, geolocPosition } =
    useLocation()

  const { disabilities } = useAccessibilityFiltersContext()
  const isUserUnderage = useIsUserUnderage()

  const { data: remoteConfig } = useRemoteConfigQuery()
  const artistsFromRemoteConfig = remoteConfig.artistPageSubcategories.subcategories
  const { data: venueArtists } = getVenueOffersArtists(artistsFromRemoteConfig)

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

  const query = useSearchArtistsQuery(queryParams, {
    select: (data) => selectSearchArtists(data, null),
  })

  const artistsFromVenue = venueArtists?.artists
  const artistsFromSearch = query.data
  const venueArtistsList = artistsFromVenue?.length ? artistsFromVenue : undefined
  const searchArtistsList = artistsFromSearch
  const items = venueArtistsList ?? searchArtistsList ?? NO_ARTISTS
  const nbItems = items.length

  return {
    items,
    title,
    subtitle,
    nbItems,
  }
}
