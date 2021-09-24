import { useMemo } from 'react'
import { isMobileOnly } from 'react-device-detect'
import { useWindowDimensions } from 'react-native'

import { Layout } from 'features/home/contentful'
import { SearchHit } from 'libs/search'
import { LENGTH_L, LENGTH_M, MARGIN_DP, RATIO_HOME_IMAGE } from 'ui/theme'

export const useLayoutHits = (layout: Layout, hits: SearchHit[]) => {
  const { width: windowWidth } = useWindowDimensions()

  return useMemo(() => {
    const imageHeight = layout === 'two-items' ? LENGTH_M : LENGTH_L
    const imageWidth = imageHeight * RATIO_HOME_IMAGE + 16
    if (isMobileOnly) {
      return hits
    } else {
      const windowWithWithoutMargin = windowWidth - MARGIN_DP * 2
      const nbHitsPerRow = Math.floor(windowWithWithoutMargin / imageWidth) - 1
      return hits.length <= nbHitsPerRow ? hits : hits.slice(0, nbHitsPerRow)
    }
  }, [hits, windowWidth, layout])
}
