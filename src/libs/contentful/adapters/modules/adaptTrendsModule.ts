import { Platform } from 'react-native'

import MapImage from 'features/home/images/map.png'
import { HomepageModuleType, TrendBlock, TrendsModule } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import {
  ContentTypes,
  isVenueMapBlockContentModel,
  TrendBlockContentModel,
  TrendsContentModel,
  VenueMapBlockContentModel,
} from 'libs/contentful/types'
import { isNonNullable } from 'shared/typeguards/isNonNullable'

import { ContentfulAdapter } from '../contentfulAdapters'

export const adaptTrendsModule: ContentfulAdapter<TrendsContentModel, TrendsModule> = (module) => {
  if (module.fields === undefined) return null

  return {
    id: module.sys.id,
    type: HomepageModuleType.TrendsModule,
    items: module.fields.items.map(adaptTrendBlock).filter(isNonNullable),
  }
}

const adaptTrendBlock = (
  trend: TrendBlockContentModel | VenueMapBlockContentModel
): TrendBlock | null => {
  if (trend.fields === undefined) return null

  if (isVenueMapBlockContentModel(trend)) {
    const { title, homeEntryId } = trend.fields
    if (!homeEntryId && Platform.OS === 'web') return null
    return {
      id: trend.sys.id,
      title,
      homeEntryId,
      image: MapImage,
      type: ContentTypes.VENUE_MAP_BLOCK,
    }
  }

  const { title, image, homeEntryId } = trend.fields

  const imageUrl = buildImageUrl(image.fields?.file.url)
  if (!imageUrl) return null

  return {
    id: trend.sys.id,
    title,
    homeEntryId,
    image: { uri: imageUrl },
    type: ContentTypes.TREND_BLOCK,
  }
}
