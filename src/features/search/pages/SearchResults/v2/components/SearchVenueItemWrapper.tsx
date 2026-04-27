import React, { FC } from 'react'
import { useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { SearchVenueItem } from 'features/search/components/SearchVenueItems/SearchVenueItem'
import { getGridTileRatio } from 'features/search/helpers/getGridTileRatio'
import { SearchResultVenue } from 'features/search/types'
import { MARGIN_DP } from 'ui/theme'

const TILE_HEIGHT = 103.67

type SearchVenueItemWrapper = {
  item: SearchResultVenue
  index: number
}

export const SearchVenueItemWrapper: FC<SearchVenueItemWrapper> = ({ item, index }) => {
  const { width } = useWindowDimensions()
  const { designSystem, breakpoints } = useTheme()
  const margin = designSystem.size.spacing.xl
  const gutter = designSystem.size.spacing.l
  const { tileWidth } = getGridTileRatio({
    screenWidth: width,
    margin,
    gutter,
    breakpoint: breakpoints.lg,
  })
  return (
    <SearchVenueItemContainer>
      <SearchVenueItem venue={item.data} height={TILE_HEIGHT} width={tileWidth} index={index} />
    </SearchVenueItemContainer>
  )
}

const SearchVenueItemContainer = styled.View({
  marginBottom: MARGIN_DP,
})
