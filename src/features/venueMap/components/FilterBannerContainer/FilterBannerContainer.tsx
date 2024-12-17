import React from 'react'
import styled from 'styled-components/native'

import { FILTER_BANNER_HEIGHT } from 'features/venueMap/constant'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { getSpacing } from 'ui/theme'

import { FilterCategoriesBannerContainer } from './FilterCategoriesBannerContainer'
import { SingleFilterBannerContainer } from './SingleFilterBannerContainer'

export const FilterBannerContainer = () => {
  const headerHeight = useGetHeaderHeight()

  const filterCategoriesActive = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_VENUE_MAP_TYPE_FILTER_V2
  )

  return (
    <Container headerHeight={headerHeight}>
      {filterCategoriesActive ? (
        <FilterCategoriesBannerContainer />
      ) : (
        <SingleFilterBannerContainer />
      )}
    </Container>
  )
}

const Container = styled.View<{ headerHeight: number }>(({ headerHeight }) => ({
  height: FILTER_BANNER_HEIGHT,
  marginTop: headerHeight,
  paddingHorizontal: getSpacing(6),
  paddingVertical: getSpacing(1),
}))
