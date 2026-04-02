import { useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { useWindowDimensions, FlatList, Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useGetOffersDataQuery } from 'features/home/queries/useGetOffersDataQuery'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { NumberOfResults } from 'features/search/components/NumberOfResults/NumberOfResults'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getGridTileRatio } from 'features/search/helpers/getGridTileRatio'
import { gridListLayoutActions, useGridListLayout } from 'features/search/store/gridListLayoutStore'
import { GridListLayout } from 'features/search/types'
import { analytics } from 'libs/analytics/provider'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { Offer } from 'shared/offer/types'
import { GridLayoutButton } from 'ui/components/buttons/GridLayoutButton'
import { ListLayoutButton } from 'ui/components/buttons/ListLayoutButton'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { LineSeparator } from 'ui/components/LineSeparator'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Page } from 'ui/pages/Page'
import { RATIO_HOME_IMAGE, Typo, Spacer } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const isWeb = Platform.OS === 'web'
const numColumns = 2

export const VerticalPlaylistPage = () => {
  const headerHeight = useGetHeaderHeight()
  const { searchState } = useSearch()
  const { designSystem, breakpoints, contentPage, isMobileViewport } = useTheme()
  const { width } = useWindowDimensions()
  const { params } = useRoute<UseRouteType<'VerticalPlaylistPage'>>()
  const { module } = params

  const playlistTitle = module.displayParameters?.title
  const playlistSubtitle = module.displayParameters?.subtitle

  const items = (useGetOffersDataQuery([module])[0]?.playlistItems ?? []) as Offer[]

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
            {playlistSubtitle ? <StyledSubtitle>{playlistSubtitle}</StyledSubtitle> : null}
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

const StyledSubtitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.m,
  color: theme.designSystem.color.text.subtle,
}))

const GridSeparator = styled.View(({ theme }) => ({
  paddingBottom: theme.designSystem.size.spacing.l,
}))

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
