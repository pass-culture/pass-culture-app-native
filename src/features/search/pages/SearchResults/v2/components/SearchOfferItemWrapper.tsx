import React, { FC } from 'react'
import { Platform, useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components/native'

import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getGridTileRatio } from 'features/search/helpers/getGridTileRatio'
import { useGridListLayout } from 'features/search/store/gridListLayoutStore'
import { GridListLayout, SearchResultOffer } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { RATIO_HOME_IMAGE } from 'ui/theme'

type SearchOfferItemWrapper = {
  item: SearchResultOffer
  index: number
}

const isWeb = Platform.OS === 'web'

export const SearchOfferItemWrapper: FC<SearchOfferItemWrapper> = ({ item, index }) => {
  const {
    searchState: { query, searchId },
  } = useSearch()

  const { width } = useWindowDimensions()
  const { designSystem, breakpoints } = useTheme()
  const margin = designSystem.size.spacing.xl
  const gutter = designSystem.size.spacing.l
  const { tileWidth, nbrOfTilesToDisplay } = getGridTileRatio({
    screenWidth: width,
    margin,
    gutter,
    breakpoint: breakpoints.lg,
  })

  const enableGridList = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_GRID_LIST)
  const gridListLayout = useGridListLayout()
  const isGridLayout = enableGridList && !isWeb && gridListLayout === GridListLayout.GRID

  return (
    <React.Fragment>
      {isGridLayout ? (
        <OfferTileWrapper
          item={item.data}
          analyticsFrom="searchresults"
          height={tileWidth / RATIO_HOME_IMAGE}
          width={tileWidth}
          containerWidth={width / nbrOfTilesToDisplay}
          searchId={searchId}
          withCenterAlign={false}
        />
      ) : (
        <HorizontalOfferTile
          offer={item.data}
          analyticsParams={{
            query,
            index,
            searchId,
            from: 'searchresults',
          }}
        />
      )}
    </React.Fragment>
  )
}
