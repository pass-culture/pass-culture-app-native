import { useRoute } from '@react-navigation/native'
import React from 'react'
import { FlatList, useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { VenueTile } from 'features/home/components/modules/venues/VenueTile'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { getGridTileRatio } from 'features/search/helpers/getGridTileRatio'
import { VenueHit } from 'libs/algolia/types'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { NumberOfItems } from 'shared/NumberOfItems/NumberOfItems'
import { useGetVenuesFromPlaylist } from 'shared/verticalPlaylist/helpers/useGetVenuesFromPlaylist'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Page } from 'ui/pages/Page'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const VerticalPlaylistVenues = () => {
  const { params } = useRoute<UseRouteType<'VerticalPlaylistVenues'>>()
  const { title, subtitle, items, nbItems } = useGetVenuesFromPlaylist(params.module)
  const headerHeight = useGetHeaderHeight()
  const { designSystem, breakpoints, tiles } = useTheme()
  const { width } = useWindowDimensions()
  const margin = designSystem.size.spacing.xl
  const listTileWidth = width - margin * 2
  const gutter = designSystem.size.spacing.l
  const grid = getGridTileRatio({
    screenWidth: width,
    margin,
    gutter,
    breakpoint: breakpoints.lg,
  })

  const layout = useMobileFontScaleToDisplay({
    default: {
      key: 'grid',
      numColumns: 2,
      width: grid.tileWidth,
      columnWrapperStyle: { justifyContent: 'space-between' } as const,
    },
    at200PercentZoom: {
      key: 'list',
      numColumns: 1,
      width: listTileWidth,
      columnWrapperStyle: undefined,
    },
  })

  const renderItem = ({ item }: { item: VenueHit }) => (
    <VenueTile
      venue={item}
      width={layout.width}
      height={tiles.sizes.medium.height}
      moduleName="VerticalPlaylistVenues"
      moduleId="VerticalPlaylistVenues"
    />
  )

  return (
    <Page>
      <PageHeaderWithoutPlaceholder />
      <StyledFlatList
        numColumns={layout.numColumns}
        columnWrapperStyle={layout.columnWrapperStyle}
        data={items}
        keyExtractor={(item) => item.id.toString()}
        key={layout.key}
        renderItem={renderItem}
        ItemSeparatorComponent={GridSeparator}
        ListHeaderComponent={
          <React.Fragment>
            <Placeholder height={headerHeight} />
            <Typo.Title2 {...getHeadingAttrs(1)}>{title}</Typo.Title2>
            {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
            <TitleContainer>
              <NumberOfItems nbItems={nbItems} type="venues" />
            </TitleContainer>
          </React.Fragment>
        }
        ListFooterComponent={<Spacer.BottomScreen />}
      />
    </Page>
  )
}

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const TitleContainer = styled.View({
  justifyContent: 'center',
})

const Subtitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.m,
  color: theme.designSystem.color.text.subtle,
}))

const GridSeparator = styled.View(({ theme }) => ({
  paddingBottom: theme.designSystem.size.spacing.l,
}))

const StyledFlatList = styled(FlatList<VenueHit>).attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingVertical: theme.contentPage.marginVertical,
  },
}))``
