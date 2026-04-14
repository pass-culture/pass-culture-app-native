import { useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { FlatList, Platform, useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { NumberOfResults } from 'features/search/components/NumberOfResults/NumberOfResults'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getGridTileRatio } from 'features/search/helpers/getGridTileRatio'
import { gridListLayoutActions, useGridListLayout } from 'features/search/store/gridListLayoutStore'
import { GridListLayout } from 'features/search/types'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'
import { useVenueQuery } from 'features/venue/queries/useVenueQuery'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location/location'
import { useVenueOffersQuery } from 'queries/venue/useVenueOffersQuery'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { Offer } from 'shared/offer/types'
import { GridLayoutButton } from 'ui/components/buttons/GridLayoutButton'
import { ListLayoutButton } from 'ui/components/buttons/ListLayoutButton'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { LineSeparator } from 'ui/components/LineSeparator'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Page } from 'ui/pages/Page'
import { RATIO_HOME_IMAGE, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const isWeb = Platform.OS === 'web'
const numColumns = 2

export const VerticalPlaylistPage2 = () => {
  const headerHeight = useGetHeaderHeight()
  const { params } = useRoute<UseRouteType<'VerticalPlaylistPage2'>>()
  const { venueId, playlistTitle } = params

  const { width } = useWindowDimensions()
  const { userLocation, selectedLocationMode } = useLocation()
  const transformHits = useTransformOfferHits()
  const { searchState } = useSearch()
  const isUserUnderage = useIsUserUnderage()
  const { designSystem, breakpoints, contentPage, isMobileViewport } = useTheme()

  const { data: venue } = useVenueQuery(venueId)
  const venueSearchParams = useVenueSearchParameters(venue)

  const { data } = useVenueOffersQuery({
    userLocation,
    selectedLocationMode,
    isUserUnderage,
    venueSearchParams,
    searchState,
    transformHits,
    venue,
  })

  const items =
    data?.hits.filter((offer) => offer.offer.subcategoryId !== SubcategoryIdEnum.SEANCE_CINE) ?? []

  const nbHits = items.length
  const selectedGridListLayout = useGridListLayout()

  const canUseGrid = isMobileViewport && !isWeb
  const isGridLayout = canUseGrid && selectedGridListLayout === GridListLayout.GRID

  const onGridListButtonPress = (layout: GridListLayout) => {
    if (!canUseGrid) return
    gridListLayoutActions.setLayout(layout)
    void analytics.logHasClickedGridListToggle({ fromLayout: selectedGridListLayout })
  }

  const getLayoutButtonProps = (layout: GridListLayout) => ({
    layout,
    isSelected: selectedGridListLayout === layout,
    onPress: () => onGridListButtonPress(layout),
  })

  const { tileWidth, nbrOfTilesToDisplay } = getGridTileRatio({
    screenWidth: width,
    margin: designSystem.size.spacing.xl,
    gutter: designSystem.size.spacing.l,
    breakpoint: breakpoints.lg,
  })

  const renderItem = useCallback(
    ({ item, index }: { item: Offer; index: number }) =>
      isGridLayout ? (
        <OfferTileWrapper
          item={item}
          analyticsFrom="verticalplaylistpage"
          height={tileWidth / RATIO_HOME_IMAGE}
          width={tileWidth}
          searchId={searchState.searchId}
          containerWidth={width / nbrOfTilesToDisplay - contentPage.marginHorizontal}
        />
      ) : (
        <HorizontalOfferTile
          offer={item}
          analyticsParams={{
            query: searchState.query,
            index,
            searchId: searchState.searchId,
            from: 'verticalplaylistpage',
          }}
        />
      ),
    [
      isGridLayout,
      tileWidth,
      searchState.searchId,
      searchState.query,
      width,
      nbrOfTilesToDisplay,
      contentPage.marginHorizontal,
    ]
  )

  return (
    <Page>
      <PageHeaderWithoutPlaceholder />
      <FlatList
        data={items}
        keyExtractor={(item) => item.objectID}
        key={isGridLayout ? 'grid_playlist' : 'list_playlist'}
        renderItem={renderItem}
        numColumns={isGridLayout ? numColumns : undefined}
        ItemSeparatorComponent={isGridLayout ? GridSeparator : LineSeparator}
        ListHeaderComponent={
          <React.Fragment>
            <Placeholder height={headerHeight} />
            <Typo.Title2 {...getHeadingAttrs(1)}>{playlistTitle}</Typo.Title2>
            <HeaderSectionContainer>
              <TitleContainer>
                <NumberOfResults nbHits={nbHits} />
              </TitleContainer>
              {canUseGrid ? (
                <GridListMenu>
                  <ListLayoutButton {...getLayoutButtonProps(GridListLayout.LIST)} />
                  <GridLayoutButton {...getLayoutButtonProps(GridListLayout.GRID)} />
                </GridListMenu>
              ) : null}
            </HeaderSectionContainer>
          </React.Fragment>
        }
        ListFooterComponent={<Spacer.BottomScreen />}
        contentContainerStyle={{
          paddingHorizontal: contentPage.marginHorizontal,
          paddingVertical: contentPage.marginVertical,
        }}
      />
    </Page>
  )
}

const GridListMenu = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginBottom: theme.designSystem.size.spacing.m,
}))

const HeaderSectionContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.designSystem.size.spacing.m,
  marginTop: theme.designSystem.size.spacing.l,
}))

const TitleContainer = styled.View({
  flex: 1,
})

const GridSeparator = styled.View(({ theme }) => ({
  paddingBottom: theme.designSystem.size.spacing.l,
}))

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
