import { SearchResponse } from '@algolia/client-search'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useMemo } from 'react'
import { ScrollViewProps, View } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { GeolocationBanner } from 'features/home/components/banners/GeolocationBanner'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { SearchOfferHits } from 'features/search/api/useSearchResults/useSearchResults'
import { NumberOfResults } from 'features/search/components/NumberOfResults/NumberOfResults'
import { SearchVenueItem } from 'features/search/components/SearchVenueItems/SearchVenueItem'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchVenuePlaylistTitle } from 'features/search/helpers/getSearchVenuePlaylistTitle/getSearchVenuePlaylistTitle'
import { VenuesUserData } from 'features/search/types'
import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'
import { useInitialVenuesActions } from 'features/venueMap/store/initialVenuesStore'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'
import { AlgoliaVenue } from 'libs/algolia/types'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useFunctionOnce } from 'libs/hooks'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { Offer } from 'shared/offer/types'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Playlist } from 'ui/components/Playlist'
import { Separator } from 'ui/components/Separator'
import { Error } from 'ui/svg/icons/Error'
import { Map } from 'ui/svg/icons/Map'
import { getSpacing, LENGTH_XS, LENGTH_XXS, Spacer, TypoDS } from 'ui/theme'

interface SearchListHeaderProps extends ScrollViewProps {
  nbHits: number
  userData: SearchResponse<Offer[]>['userData']
  venues?: SearchOfferHits['venues']
  venuesUserData: VenuesUserData
}

const renderVenueItem = (
  {
    item,
    height,
    width,
  }: {
    item: AlgoliaVenue
    height: number
    width: number
  },
  searchId?: string
) => <SearchVenueItem venue={item} height={height} width={width} searchId={searchId} />

const VENUE_ITEM_HEIGHT = LENGTH_XXS
const VENUE_ITEM_WIDTH = LENGTH_XS
const keyExtractor = (item: AlgoliaVenue) => item.objectID

export const SearchListHeader: React.FC<SearchListHeaderProps> = ({
  nbHits,
  userData,
  venues,
  venuesUserData,
}) => {
  const { geolocPosition, showGeolocPermissionModal, selectedLocationMode } = useLocation()
  const { disabilities } = useAccessibilityFiltersContext()
  const {
    searchState: { searchId, venue, offerCategories },
  } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()
  const { setInitialVenues } = useInitialVenuesActions()

  const isLocated = useMemo(
    () => selectedLocationMode !== LocationMode.EVERYWHERE,
    [selectedLocationMode]
  )

  const logVenuePlaylistDisplayedOnSearchResultsOnce = useFunctionOnce(() =>
    analytics.logVenuePlaylistDisplayedOnSearchResults({
      searchId,
      isLocated,
      searchNbResults: venues?.length,
    })
  )

  const logAllTilesSeenOnce = useFunctionOnce(() => analytics.logAllTilesSeen({ searchId }))

  const shouldDisplayAvailableUserDataMessage = userData?.length > 0
  const unavailableOfferMessage = shouldDisplayAvailableUserDataMessage ? userData[0]?.message : ''
  const shouldDisplayAccessibilityContent =
    Object.values(disabilities).filter((disability) => disability).length > 0
  const venuePlaylistTitle = getSearchVenuePlaylistTitle(
    shouldDisplayAccessibilityContent,
    venuesUserData?.[0]?.venue_playlist_title
  )

  const offerTitle = shouldDisplayAccessibilityContent
    ? 'Les offres dans des lieux accessibles'
    : 'Les offres'
  const shouldDisplayVenuesPlaylist = !venue && !!venues?.length
  const onPress = () => {
    analytics.logActivateGeolocfromSearchResults()
    showGeolocPermissionModal()
  }

  useEffect(() => {
    if (shouldDisplayVenuesPlaylist) {
      logVenuePlaylistDisplayedOnSearchResultsOnce()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logVenuePlaylistDisplayedOnSearchResultsOnce, shouldDisplayVenuesPlaylist])

  const shouldDisplayGeolocationButton =
    geolocPosition === null &&
    offerCategories?.[0] !== SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE &&
    nbHits > 0 &&
    !shouldDisplayAvailableUserDataMessage

  const { shouldDisplayVenueMap } = useShouldDisplayVenueMap()
  const shouldDisplayVenueMapInSearch = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_VENUE_MAP_IN_SEARCH
  )

  const handleSeeMapPress = () => {
    setInitialVenues(venues?.length ? adaptAlgoliaVenues(venues) : [])
    analytics.logConsultVenueMap({ from: 'searchPlaylist' })
    navigate('VenueMap')
  }

  return (
    <View testID="searchListHeader">
      {shouldDisplayGeolocationButton ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <GeolocationButtonContainer>
            <GeolocationBanner
              title="Géolocalise-toi"
              subtitle="Pour trouver des offres autour de toi"
              analyticsFrom="search"
              onPress={onPress}
            />
          </GeolocationButtonContainer>
        </React.Fragment>
      ) : null}
      {shouldDisplayAvailableUserDataMessage ? (
        <BannerOfferNotPresentContainer
          testID="banner-container"
          accessibilityRole={AccessibilityRole.STATUS}
          nbHits={nbHits}>
          <InfoBanner message={unavailableOfferMessage} icon={Error} />
        </BannerOfferNotPresentContainer>
      ) : null}
      {shouldDisplayVenuesPlaylist ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <View>
            <Title>{venuePlaylistTitle}</Title>
            {shouldDisplayVenueMap && !shouldDisplayVenueMapInSearch ? (
              <ButtonContainer>
                <Spacer.Column numberOfSpaces={1} />
                <ButtonTertiaryBlack
                  icon={Map}
                  wording={`Voir sur la carte (${venues?.length})`}
                  onPress={handleSeeMapPress}
                />
              </ButtonContainer>
            ) : (
              <NumberOfResults nbHits={venues?.length ?? 0} />
            )}
            <Playlist
              data={venues ?? []}
              // +4 to take into account the margin top
              scrollButtonOffsetY={VENUE_ITEM_HEIGHT / 2 + 4}
              itemHeight={VENUE_ITEM_HEIGHT}
              itemWidth={VENUE_ITEM_WIDTH}
              renderItem={({ item, height, width }) =>
                renderVenueItem({ item, height, width }, searchId)
              }
              renderHeader={undefined}
              renderFooter={undefined}
              keyExtractor={keyExtractor}
              testID="search-venue-list"
              onEndReached={logAllTilesSeenOnce}
            />
          </View>
          <Spacer.Column numberOfSpaces={3} />
          <StyledSeparator />
        </React.Fragment>
      ) : null}
      <Spacer.Column numberOfSpaces={4} />
      <Title>{offerTitle}</Title>
      <NumberOfResults nbHits={nbHits} />
    </View>
  )
}

const GeolocationButtonContainer = styled.View(({ theme }) => ({
  marginLeft: theme.contentPage.marginHorizontal,
  marginRight: theme.contentPage.marginHorizontal,
  marginBottom: getSpacing(4),
}))

const BannerOfferNotPresentContainer = styled.View<{ nbHits: number }>(({ nbHits }) => ({
  paddingHorizontal: getSpacing(6),
  ...(nbHits > 0 && { paddingBottom: getSpacing(4) }),
}))

const Title = styled(TypoDS.Title3)({
  marginHorizontal: getSpacing(6),
})

const StyledSeparator = styled(Separator.Horizontal)({
  width: 'auto',
  marginLeft: getSpacing(6),
  marginRight: getSpacing(6),
})

const ButtonContainer = styled.View({
  marginLeft: getSpacing(6),
  alignSelf: 'flex-start',
})
