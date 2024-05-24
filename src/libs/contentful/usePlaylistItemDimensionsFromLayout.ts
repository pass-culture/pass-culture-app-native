import { PixelRatio } from 'react-native'

import { Layout } from 'libs/contentful/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LENGTH_L, LENGTH_M, MARGIN_DP, RATIO_HOME_IMAGE } from 'ui/theme'

const LENGTH_S = PixelRatio.roundToNearestPixel(6.5 * MARGIN_DP)
const LENGTH_XL = PixelRatio.roundToNearestPixel(17.5 * MARGIN_DP)

export function usePlaylistItemDimensionsFromLayout(layout: Layout): {
  itemWidth: number
  itemHeight: number
} {
  const enableV2Sizes = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_HOME_MODULE_SIZES)

  if (enableV2Sizes) {
    switch (layout) {
      case 'three-items':
        return { itemHeight: LENGTH_S, itemWidth: LENGTH_S * RATIO_HOME_IMAGE }
      case 'one-item-medium':
        return { itemHeight: LENGTH_XL, itemWidth: LENGTH_XL * RATIO_HOME_IMAGE }
      case 'two-items':
      default:
        return { itemHeight: LENGTH_M, itemWidth: LENGTH_M * RATIO_HOME_IMAGE }
    }
  }

  const itemHeight = layout === 'two-items' ? LENGTH_M : LENGTH_L
  return { itemHeight, itemWidth: itemHeight * RATIO_HOME_IMAGE }
}
