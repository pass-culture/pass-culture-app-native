import React from 'react'
import styled from 'styled-components/native'

import { FILTER_BANNER_HEIGHT } from 'features/venueMap/constant'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { getSpacing } from 'ui/theme'

import { FilterCategoriesBannerContainer } from './FilterCategoriesBannerContainer'

export const FilterBannerContainer = () => {
  const headerHeight = useGetHeaderHeight()

  return (
    <Container headerHeight={headerHeight}>
      <FilterCategoriesBannerContainer />
    </Container>
  )
}

const Container = styled.View<{ headerHeight: number }>(({ headerHeight }) => ({
  height: FILTER_BANNER_HEIGHT,
  marginTop: headerHeight,
  paddingHorizontal: getSpacing(6),
  paddingVertical: getSpacing(1),
}))
