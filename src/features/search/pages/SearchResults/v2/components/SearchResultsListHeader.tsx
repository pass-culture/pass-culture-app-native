import { SearchResponse } from 'algoliasearch/lite'
import React from 'react'
import { ScrollViewProps, View } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { NumberOfResults } from 'features/search/components/NumberOfResults/NumberOfResults'
import { useSearch } from 'features/search/context/SearchWrapper'
import { gridListLayoutActions, useGridListLayout } from 'features/search/store/gridListLayoutStore'
import { GridListLayout } from 'features/search/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location/location'
import { GeolocationBanner } from 'shared/Banners/GeolocationBanner'
import { Offer } from 'shared/offer/types'
import { GridLayoutButton } from 'ui/components/buttons/GridLayoutButton'
import { ListLayoutButton } from 'ui/components/buttons/ListLayoutButton'
import { AIFakeDoorBanner } from 'ui/components/ModuleBanner/AIFakeDoorBanner'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Error } from 'ui/svg/icons/Error'
import { Typo } from 'ui/theme'

type SearchListHeaderProps = ScrollViewProps & {
  nbHits: number
  title: string
  userData: SearchResponse<Offer[]>['userData']
  venuesSection?: React.ReactNode
  artistSection?: React.ReactNode
  shouldDisplayGridList?: boolean
  enableAIFakeDoor?: boolean
  onPressAIFakeDoorBanner: () => void
}

export const SearchResultsListHeader: React.FC<SearchListHeaderProps> = ({
  nbHits,
  title,
  userData,
  venuesSection,
  artistSection,
  shouldDisplayGridList,
  enableAIFakeDoor,
  onPressAIFakeDoorBanner,
}) => {
  const { geolocPosition, showGeolocPermissionModal } = useLocation()
  const {
    searchState: { offerCategories },
  } = useSearch()

  const shouldDisplayAvailableUserDataMessage = userData?.length > 0
  const unavailableOfferMessage = shouldDisplayAvailableUserDataMessage ? userData[0]?.message : ''

  const selectedGridListLayout = useGridListLayout()

  const onPress = () => {
    void analytics.logActivateGeolocfromSearchResults()
    showGeolocPermissionModal()
  }

  const shouldDisplayGeolocationBanner =
    geolocPosition === null &&
    offerCategories?.[0] !== SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE &&
    nbHits > 0 &&
    !shouldDisplayAvailableUserDataMessage

  const onGridListButtonPress = (layout: GridListLayout) => {
    gridListLayoutActions.setLayout(layout)
    void analytics.logHasClickedGridListToggle({ fromLayout: selectedGridListLayout })
  }

  const getLayoutButtonProps = (layout: GridListLayout) => ({
    layout,
    isSelected: selectedGridListLayout === layout,
    onPress: () => onGridListButtonPress(layout),
  })

  return (
    <View testID="searchListHeader">
      {enableAIFakeDoor ? (
        <AIFakeDoorBannerContainer>
          <AIFakeDoorBanner onPress={onPressAIFakeDoorBanner} />
        </AIFakeDoorBannerContainer>
      ) : null}
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
          <Banner label={unavailableOfferMessage} Icon={Error} />
        </BannerOfferNotPresentContainer>
      ) : null}
      {artistSection}
      {venuesSection}
      {nbHits ? (
        <HeaderSectionContainer>
          <TitleContainer>
            <Title>{title}</Title>
            <NumberOfResults nbHits={nbHits} />
          </TitleContainer>
          {shouldDisplayGridList ? (
            <GridListMenu testID="grid-list-menu">
              <ListLayoutButton {...getLayoutButtonProps(GridListLayout.LIST)} />
              <GridLayoutButton {...getLayoutButtonProps(GridListLayout.GRID)} />
            </GridListMenu>
          ) : null}
        </HeaderSectionContainer>
      ) : null}
    </View>
  )
}

const GridListMenu = styled(View)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  marginTop: theme.designSystem.size.spacing.l,
}))

const HeaderSectionContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const TitleContainer = styled.View({
  flex: 1,
  flexDirection: 'column',
})

const GeolocationBannerContainer = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))

const BannerOfferNotPresentContainer = styled.View<{ nbHits: number }>(({ nbHits, theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  ...(nbHits > 0 && { paddingBottom: theme.designSystem.size.spacing.l }),
}))

const Title = styled(Typo.Title3)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))

const AIFakeDoorBannerContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
