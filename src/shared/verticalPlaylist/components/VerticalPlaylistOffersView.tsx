import React, { useCallback } from 'react'
import { FlatList, Platform, useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Referrals } from 'features/navigation/RootNavigator/types'
import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { NumberOfOffers } from 'features/search/components/NumberOfOffers/NumberOfOffers'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getGridTileRatio } from 'features/search/helpers/getGridTileRatio'
import { useGridListLayout, gridListLayoutActions } from 'features/search/store/gridListLayoutStore'
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
import { RATIO_HOME_IMAGE, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const isWeb = Platform.OS === 'web'
const numColumns = 2

type Props = {
  title: string
  subtitle?: string
  items: Offer[]
  searchId?: string
  searchQuery?: string
  analyticsFrom: Referrals
}

export const VerticalPlaylistOffersView = ({
  title,
  subtitle,
  items,
  searchId,
  searchQuery,
  analyticsFrom,
}: Props) => {
  const headerHeight = useGetHeaderHeight()
  const { width } = useWindowDimensions()
  const { searchState } = useSearch()
  const { designSystem, breakpoints, contentPage, isMobileViewport } = useTheme()

  const selectedGridListLayout = useGridListLayout()

  const canUseGrid = isMobileViewport && !isWeb
  const isGridLayout = canUseGrid && selectedGridListLayout === GridListLayout.GRID

  const nbHits = items.length

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
          analyticsFrom={analyticsFrom}
          height={tileWidth / RATIO_HOME_IMAGE}
          width={tileWidth}
          searchId={searchId}
          containerWidth={width / nbrOfTilesToDisplay - contentPage.marginHorizontal}
        />
      ) : (
        <HorizontalOfferTile
          offer={item}
          analyticsParams={{
            query: searchQuery ?? searchState.query,
            index,
            searchId,
            from: analyticsFrom,
          }}
        />
      ),
    [
      isGridLayout,
      tileWidth,
      width,
      nbrOfTilesToDisplay,
      contentPage.marginHorizontal,
      searchId,
      searchQuery,
      searchState.query,
      analyticsFrom,
    ]
  )

  return (
    <Page>
      <PageHeaderWithoutPlaceholder />

      <FlatList
        data={items}
        keyExtractor={(item) => item.objectID}
        key={isGridLayout ? 'grid' : 'list'}
        renderItem={renderItem}
        numColumns={isGridLayout ? numColumns : undefined}
        ItemSeparatorComponent={isGridLayout ? GridSeparator : LineSeparator}
        ListHeaderComponent={
          <React.Fragment>
            <Placeholder height={headerHeight} />
            <Typo.Title2 {...getHeadingAttrs(1)}>{title}</Typo.Title2>
            {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
            <HeaderRow>
              <TitleContainer>
                <NumberOfOffers nbHits={nbHits} />
              </TitleContainer>
              {canUseGrid ? (
                <GridListMenu>
                  <ListLayoutButton {...getLayoutButtonProps(GridListLayout.LIST)} />
                  <GridLayoutButton {...getLayoutButtonProps(GridListLayout.GRID)} />
                </GridListMenu>
              ) : null}
            </HeaderRow>
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

const Subtitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.m,
  color: theme.designSystem.color.text.subtle,
}))

const HeaderRow = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: theme.designSystem.size.spacing.l,
  marginBottom: theme.designSystem.size.spacing.m,
}))

const GridListMenu = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginBottom: theme.designSystem.size.spacing.m,
}))

const GridSeparator = styled.View(({ theme }) => ({
  paddingBottom: theme.designSystem.size.spacing.l,
}))

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const TitleContainer = styled.View({
  flex: 1,
  justifyContent: 'center',
})
