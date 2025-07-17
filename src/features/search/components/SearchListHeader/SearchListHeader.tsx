import { SearchResponse } from '@algolia/client-search'
import React, { useMemo, useState } from 'react'
import { ScrollViewProps, View } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { usePreviousRoute } from 'features/navigation/helpers/usePreviousRoute'
import { SearchOfferHits } from 'features/search/api/useSearchResults/useSearchResults'
import { NumberOfResults } from 'features/search/components/NumberOfResults/NumberOfResults'
import { VenuePlaylist } from 'features/search/components/VenuePlaylist/VenuePlaylist'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchVenuePlaylistTitle } from 'features/search/helpers/getSearchVenuePlaylistTitle/getSearchVenuePlaylistTitle'
import { GridListLayout, SearchView, VenuesUserData } from 'features/search/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { GeolocationBanner } from 'shared/Banners/GeolocationBanner'
import { Offer } from 'shared/offer/types'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { GridLayoutButton } from 'ui/components/buttons/GridLayoutButton'
import { ListLayoutButton } from 'ui/components/buttons/ListLayoutButton'
import { Error } from 'ui/svg/icons/Error'
import { Typo, getSpacing } from 'ui/theme'

interface SearchListHeaderProps extends ScrollViewProps {
  nbHits: number
  userData: SearchResponse<Offer[]>['userData']
  venues?: SearchOfferHits['venues']
  venuesUserData: VenuesUserData
  artistSection?: React.ReactNode
  setGridListLayout?: React.Dispatch<React.SetStateAction<GridListLayout>>
}

const isWeb = Platform.OS === 'web'

export const SearchListHeader: React.FC<SearchListHeaderProps> = ({
  nbHits,
  userData,
  venues,
  venuesUserData,
  artistSection,
  setGridListLayout,
}) => {
  const enableGridList = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_GRID_LIST)
  const shouldDisplayGridList = enableGridList && !isWeb
  const [selectedGridListLayout, setSelectedGridListLayout] = useState(GridListLayout.LIST)

  const { geolocPosition, showGeolocPermissionModal, selectedLocationMode } = useLocation()
  const { disabilities } = useAccessibilityFiltersContext()
  const {
    searchState: { venue, offerCategories },
  } = useSearch()

  const isLocated = useMemo(
    () => selectedLocationMode !== LocationMode.EVERYWHERE,
    [selectedLocationMode]
  )

  const shouldDisplayAvailableUserDataMessage = userData?.length > 0
  const unavailableOfferMessage = shouldDisplayAvailableUserDataMessage ? userData[0]?.message : ''
  const shouldDisplayAccessibilityContent =
    Object.values(disabilities).filter((disability) => disability).length > 0
  const venuePlaylistTitle = getSearchVenuePlaylistTitle(
    shouldDisplayAccessibilityContent,
    venuesUserData?.[0]?.venue_playlist_title,
    isLocated
  )

  const previousRoute = usePreviousRoute()

  const offerTitle = shouldDisplayAccessibilityContent
    ? 'Les offres dans des lieux accessibles'
    : 'Les offres'

  const shouldDisplayVenuesPlaylist =
    !venue && !!venues?.length && previousRoute?.name !== SearchView.Thematic

  const onPress = () => {
    analytics.logActivateGeolocfromSearchResults()
    showGeolocPermissionModal()
  }

  const shouldDisplayGeolocationButton =
    geolocPosition === null &&
    offerCategories?.[0] !== SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE &&
    nbHits > 0 &&
    !shouldDisplayAvailableUserDataMessage

  const onGridListButtonPress = (layout: GridListLayout) => {
    setSelectedGridListLayout(layout)
    setGridListLayout?.(layout)
  }

  const getLayoutButtonProps = (layout: GridListLayout) => ({
    layout,
    isSelected: selectedGridListLayout === layout,
    onPress: () => onGridListButtonPress(layout),
  })

  return (
    <View testID="searchListHeader">
      {shouldDisplayGeolocationButton ? (
        <GeolocationButtonContainer>
          <GeolocationBanner
            title="Géolocalise-toi"
            subtitle="Pour trouver des offres autour de toi"
            analyticsFrom="search"
            onPress={onPress}
          />
        </GeolocationButtonContainer>
      ) : null}
      {shouldDisplayAvailableUserDataMessage ? (
        <BannerOfferNotPresentContainer
          testID="banner-container"
          accessibilityRole={AccessibilityRole.STATUS}
          nbHits={nbHits}>
          <InfoBanner message={unavailableOfferMessage} icon={Error} />
        </BannerOfferNotPresentContainer>
      ) : null}
      {artistSection}
      {shouldDisplayVenuesPlaylist ? (
        <StyledVenuePlaylist
          venuePlaylistTitle={venuePlaylistTitle}
          venues={venues}
          isLocated={isLocated}
        />
      ) : null}
      <HeaderSectionContainer>
        <TitleContainer>
          <Title>{offerTitle}</Title>
          <NumberOfResults nbHits={nbHits} />
        </TitleContainer>
        {enableGridList ? (
          <GridListMenu testID="grid-list-menu">
            <ListLayoutButton {...getLayoutButtonProps(GridListLayout.LIST)} />
            <GridLayoutButton {...getLayoutButtonProps(GridListLayout.GRID)} />
          </GridListMenu>
        ) : null}
      </HeaderSectionContainer>
    </View>
  )
}

const GridListMenu = styled(View)({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginRight: getSpacing(6),
})

const HeaderSectionContainer = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const TitleContainer = styled.View({
  flexDirection: 'column',
})

const GeolocationButtonContainer = styled.View(({ theme }) => ({
  marginVertical: getSpacing(4),
  marginLeft: theme.contentPage.marginHorizontal,
  marginRight: theme.contentPage.marginHorizontal,
}))

const BannerOfferNotPresentContainer = styled.View<{ nbHits: number }>(({ nbHits }) => ({
  paddingHorizontal: getSpacing(6),
  ...(nbHits > 0 && { paddingBottom: getSpacing(4) }),
}))

const Title = styled(Typo.Title3)({
  marginHorizontal: getSpacing(6),
  marginTop: getSpacing(4),
})

const StyledVenuePlaylist = styled(VenuePlaylist)({
  marginTop: getSpacing(4),
})
