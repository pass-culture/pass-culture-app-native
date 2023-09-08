import { SearchResponse } from '@algolia/client-search'
import { useRoute } from '@react-navigation/native'
import React, { useEffect, useMemo } from 'react'
import { ScrollViewProps, View } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { NumberOfResults } from 'features/search/components/NumberOfResults/NumberOfResults'
import { SearchVenueItem } from 'features/search/components/SearchVenueItems/SearchVenueItem'
import { useSearchVenues } from 'features/search/context/SearchVenuesWrapper'
import { LocationType } from 'features/search/enums'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { AlgoliaVenue } from 'libs/algolia'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/geolocation'
import { useFunctionOnce } from 'libs/hooks'
import { Offer } from 'shared/offer/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { InfoBanner } from 'ui/components/InfoBanner'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { Playlist } from 'ui/components/Playlist'
import { Separator } from 'ui/components/Separator'
import { Touchable } from 'ui/components/touchable/Touchable'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { Error } from 'ui/svg/icons/Error'
import { getSpacing, LENGTH_XS, LENGTH_XXS, Spacer, Typo } from 'ui/theme'

interface SearchListHeaderProps extends ScrollViewProps {
  nbHits: number
  userData: SearchResponse<Offer[]>['userData']
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

export const SearchListHeader: React.FC<SearchListHeaderProps> = ({ nbHits, userData }) => {
  const { searchVenuesState: venues } = useSearchVenues()
  const { userPosition: position, showGeolocPermissionModal } = useLocation()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const enableVenuesInSearchResults = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_ENABLE_VENUES_IN_SEARCH_RESULTS
  )

  const isGeolocated = useMemo(
    () =>
      Boolean(
        params?.locationFilter && params?.locationFilter?.locationType !== LocationType.EVERYWHERE
      ),
    [params?.locationFilter]
  )

  const logVenuePlaylistDisplayedOnSearchResultsOnce = useFunctionOnce(() =>
    analytics.logVenuePlaylistDisplayedOnSearchResults({
      searchId: params?.searchId,
      isGeolocated,
      searchNbResults: venues.hits.length,
    })
  )

  const logAllTilesSeenOnce = useFunctionOnce(() =>
    analytics.logAllTilesSeen({ searchId: params?.searchId })
  )

  const shouldDisplayAvailableUserDataMessage = userData?.length > 0
  const unavailableOfferMessage = shouldDisplayAvailableUserDataMessage ? userData[0]?.message : ''
  const venueTitle = venues.userData?.[0]?.venue_playlist_title || 'Les lieux culturels'
  const offerTitle = 'Les offres'

  const shouldDisplayVenuesPlaylist = Boolean(
    params?.locationFilter?.locationType !== LocationType.VENUE &&
      venues.hits?.length &&
      enableVenuesInSearchResults
  )
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
    position === null &&
    params?.offerCategories?.[0] !== SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE &&
    nbHits > 0 &&
    !shouldDisplayAvailableUserDataMessage

  return (
    <React.Fragment>
      {!!shouldDisplayGeolocationButton && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={3} />
          <GeolocationButtonContainer
            onPress={onPress}
            accessibilityLabel="Active ta géolocalisation">
            <GenericBanner LeftIcon={LocationIcon}>
              <Typo.ButtonText>Géolocalise-toi</Typo.ButtonText>
              <Spacer.Column numberOfSpaces={1} />
              <Typo.Caption numberOfLines={2}>Pour trouver des offres autour de toi.</Typo.Caption>
            </GenericBanner>
          </GeolocationButtonContainer>
        </React.Fragment>
      )}
      {!!shouldDisplayAvailableUserDataMessage && (
        <BannerOfferNotPresentContainer
          testID="banner-container"
          accessibilityRole={AccessibilityRole.STATUS}
          nbHits={nbHits}>
          <InfoBanner message={unavailableOfferMessage} icon={Error} />
        </BannerOfferNotPresentContainer>
      )}
      {!!shouldDisplayVenuesPlaylist && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={3} />
          <View>
            <Title>{venueTitle}</Title>
            <NumberOfResults nbHits={venues.hits.length} />
            <Playlist
              data={venues.hits}
              // +4 to take into account the margin top
              scrollButtonOffsetY={VENUE_ITEM_HEIGHT / 2 + 4}
              itemHeight={VENUE_ITEM_HEIGHT}
              itemWidth={VENUE_ITEM_WIDTH}
              renderItem={({ item, height, width }) =>
                renderVenueItem({ item, height, width }, params?.searchId)
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
      )}
      <Spacer.Column numberOfSpaces={5} />
      <Title>{offerTitle}</Title>
      <NumberOfResults nbHits={nbHits} />
    </React.Fragment>
  )
}

const GeolocationButtonContainer = styledButton(Touchable)({
  marginLeft: getSpacing(6),
  marginRight: getSpacing(6),
  marginBottom: getSpacing(4),
})

const BannerOfferNotPresentContainer = styled.View<{ nbHits: number }>(({ nbHits }) => ({
  paddingHorizontal: getSpacing(6),
  ...(nbHits > 0 && { paddingBottom: getSpacing(4) }),
}))

const LocationIcon = styled(Everywhere).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
}))``

const Title = styled(Typo.Title3)({
  marginHorizontal: getSpacing(6),
})

const StyledSeparator = styled(Separator)({
  width: 'auto',
  marginLeft: getSpacing(6),
  marginRight: getSpacing(6),
})
