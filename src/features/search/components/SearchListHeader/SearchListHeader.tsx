import { SearchResponse } from '@algolia/client-search'
import React, { useMemo } from 'react'
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
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { GeolocationBanner } from 'shared/Banners/GeolocationBanner'
import { Offer } from 'shared/offer/types'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { GridLayoutButton } from 'ui/components/buttons/GridLayoutButton'
import { ListLayoutButton } from 'ui/components/buttons/ListLayoutButton'
import { Error } from 'ui/svg/icons/Error'
import { Typo } from 'ui/theme'

interface SearchListHeaderProps extends ScrollViewProps {
  nbHits: number
  userData: SearchResponse<Offer[]>['userData']
  venues?: SearchOfferHits['venues']
  venuesUserData: VenuesUserData
  artistSection?: React.ReactNode
  setGridListLayout?: React.Dispatch<React.SetStateAction<GridListLayout>>
  selectedGridListLayout?: GridListLayout
  shouldDisplayGridList?: boolean
}

export const SearchListHeader: React.FC<SearchListHeaderProps> = ({
  nbHits,
  userData,
  venues,
  venuesUserData,
  artistSection,
  setGridListLayout,
  selectedGridListLayout,
  shouldDisplayGridList,
}) => {
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

  const offerTitle = `Les offres${shouldDisplayAccessibilityContent ? ' dans des lieux accessibles' : ''}`

  const shouldDisplayVenuesPlaylist =
    !venue && !!venues?.length && previousRoute?.name !== SearchView.Thematic

  const onPress = () => {
    analytics.logActivateGeolocfromSearchResults()
    showGeolocPermissionModal()
  }

  const shouldDisplayGeolocationBanner =
    geolocPosition === null &&
    offerCategories?.[0] !== SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE &&
    nbHits > 0 &&
    !shouldDisplayAvailableUserDataMessage

  const handleToggleChange = (layout: GridListLayout) => {
    const fromLayout = layout === GridListLayout.GRID ? GridListLayout.LIST : GridListLayout.GRID
    analytics.logHasClickedGridListToggle({ fromLayout })
    setGridListLayout?.(layout)
  }

  const getLayoutButtonProps = (layout: GridListLayout) => ({
    layout,
    isSelected: selectedGridListLayout === layout,
    onPress: () => handleToggleChange(layout),
  })

  return (
    <View testID="searchListHeader">
      {shouldDisplayGeolocationBanner ? (
        <GeolocationBannerContainer>
          <GeolocationBanner
            title="Géolocalise-toi"
            subtitle="Pour trouver des offres autour de toi"
            analyticsFrom="search"
            onPress={onPress}
          />
        </GeolocationBannerContainer>
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
        {shouldDisplayGridList ? (
          <GridListMenu testID="grid-list-menu">
            <ListLayoutButton {...getLayoutButtonProps(GridListLayout.LIST)} />
            <GridLayoutButton {...getLayoutButtonProps(GridListLayout.GRID)} />
          </GridListMenu>
        ) : null}
      </HeaderSectionContainer>
    </View>
  )
}

const GridListMenu = styled(View)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  marginRight: theme.designSystem.size.spacing.xl,
  marginTop: theme.designSystem.size.spacing.l,
}))

const HeaderSectionContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const TitleContainer = styled.View(({ theme }) => ({
  flex: 1,
  flexDirection: 'column',
  marginHorizontal: theme.designSystem.size.spacing.xl,
}))

const GeolocationBannerContainer = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const BannerOfferNotPresentContainer = styled.View<{ nbHits: number }>(({ nbHits, theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  ...(nbHits > 0 && { paddingBottom: theme.designSystem.size.spacing.l }),
}))

const Title = styled(Typo.Title3)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))

const StyledVenuePlaylist = styled(VenuePlaylist)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
