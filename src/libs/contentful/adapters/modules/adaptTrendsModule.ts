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

export const adaptTrendsModule = (module: TrendsContentModel): TrendsModule | null => {
  if (module.fields === undefined) return null

  return {
    id: module.sys.id,
    type: HomepageModuleType.TrendsModule,
    items: adaptTrendBlock(module.fields.items),
  }
}

const nonNullable = <T>(value: T): value is NonNullable<T> => {
  return !!value
}

const adaptTrendBlock = (
  trendBlocks: (TrendBlockContentModel | VenueMapBlockContentModel)[]
): TrendBlock[] =>
  trendBlocks
    .map((trend) => {
      if (trend.fields === undefined) return null

      if (isVenueMapBlockContentModel(trend)) {
        const { title, homeEntryId } = trend.fields
        if (!homeEntryId) return null
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
    })
    .filter(nonNullable)
