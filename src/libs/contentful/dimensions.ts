import { Layout } from 'libs/contentful'
import { LENGTH_L, LENGTH_M, RATIO_HOME_IMAGE } from 'ui/theme'

export function getPlaylistItemDimensionsFromLayout(layout: Layout): {
  itemWidth: number
  itemHeight: number
} {
  const itemHeight = layout === 'two-items' ? LENGTH_M : LENGTH_L
  const itemWidth = itemHeight * RATIO_HOME_IMAGE
  return { itemWidth, itemHeight }
}
