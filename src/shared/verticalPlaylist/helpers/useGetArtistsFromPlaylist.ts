import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { formatArtists } from 'features/artist/helpers/formatArtists'
import { useSimilarArtistsQuery } from 'features/artist/queries/useSimilarArtistsQuery'
import { RootStackParamList } from 'features/navigation/navigators/RootNavigator/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { selectSearchArtists } from 'features/search/queries/useSearchArtists/selectors/selectSearchArtists'
import { useSearchArtistsQuery } from 'features/search/queries/useSearchArtists/useSearchArtistsQuery'
import { getVenueOffersArtists } from 'features/venue/helpers/getVenueOffersArtists'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'
import { useVenueQuery } from 'features/venue/queries/useVenueQuery'
import { Artist } from 'features/venue/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useLocation } from 'libs/location/location'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { useVenueOffersQuery } from 'queries/venue/useVenueOffersQuery'
import { VerticalPlaylistArtistsData } from 'shared/verticalPlaylist/types'

const NO_ARTISTS: Artist[] = []

type UseGetArtistsFromPlaylistProps = {
  params: RootStackParamList['VerticalPlaylistArtists']
}

export const useGetArtistsFromPlaylist = ({
  params,
}: UseGetArtistsFromPlaylistProps): VerticalPlaylistArtistsData => {
  const { title, subtitle, venueId, similarToArtistId, offerId, offerCategoryId } = params
  const isSimilar = !!similarToArtistId
  const isVenue = !isSimilar && !!venueId
  const isOffer = !!offerId
  const isSearch = !isSimilar && !isVenue && !isOffer

  const { data: offer } = useOfferQuery({
    offerId,
  })

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

  const { data: venue } = useVenueQuery(venueId ?? 0, { enabled: isVenue })

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
  const { data: venueArtists } = isVenue
    ? getVenueOffersArtists(artistsFromRemoteConfig, venueOffersHits)
    : { data: { artists: [] } }

  const query = useSearchArtistsQuery(queryParams, {
    enabled: isSearch,
    select: (data) => selectSearchArtists(data),
  })

  const { data: similarArtistsList } = useSimilarArtistsQuery(similarToArtistId ?? '', {
    enabled: isSimilar,
  })

  const artistsFromVenue = venueArtists?.artists
  const searchArtistsList = query.data

  const getItems = (): Artist[] => {
    if (isOffer) return offer?.artists ? formatArtists(offer.artists, offerCategoryId) : NO_ARTISTS
    if (isSimilar) return similarArtistsList ?? NO_ARTISTS
    if (isVenue) return artistsFromVenue ?? NO_ARTISTS
    return searchArtistsList ?? NO_ARTISTS
  }

  const items = getItems()
  const nbItems = items.length

  return {
    items,
    title,
    subtitle,
    nbItems,
  }
}
