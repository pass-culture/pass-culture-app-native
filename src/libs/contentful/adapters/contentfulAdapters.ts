import { ContentTypes, Entry } from '../types'

import { adaptBusinessModule } from './modules/adaptBusinessModule'
import { adaptCategoryListModule } from './modules/adaptCategoryListModule'
import { adaptExclusivityModule } from './modules/adaptExclusivityModule'
import { adaptHighlightOfferModule } from './modules/adaptHighlightOfferModule'
import { adaptOffersModule } from './modules/adaptOffersModule'
import { adaptRecommendationModule } from './modules/adaptRecommendationModule'
import { adaptThematicHighlightModule } from './modules/adaptThematicHighlightModule'
import { adaptTrendsModule } from './modules/adaptTrendsModule'
import { adaptVenueMapModule } from './modules/adaptVenueMapModule'
import { adaptVenuesModule } from './modules/adaptVenuesModule'
import { adaptVideoCarouselModule } from './modules/adaptVideoCarouselModule'
import { adaptVideoModule } from './modules/adaptVideoModule'

export type ContentfulAdapter<
  Contentful extends Entry<unknown, ContentTypes>,
  Module extends Record<string, unknown>,
> = (module: Contentful) => Module | null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const contentfulAdapters: Record<string, ContentfulAdapter<any, any>> = {
  [ContentTypes.ALGOLIA]: adaptOffersModule,
  [ContentTypes.BUSINESS]: adaptBusinessModule,
  [ContentTypes.RECOMMENDATION]: adaptRecommendationModule,
  [ContentTypes.THEMATIC_HIGHLIGHT]: adaptThematicHighlightModule,
  [ContentTypes.VENUES_PLAYLIST]: adaptVenuesModule,
  [ContentTypes.EXCLUSIVITY]: adaptExclusivityModule,
  [ContentTypes.CATEGORY_LIST]: adaptCategoryListModule,
  [ContentTypes.VIDEO]: adaptVideoModule,
  [ContentTypes.HIGHLIGHT_OFFER]: adaptHighlightOfferModule,
  [ContentTypes.VENUE_MAP_BLOCK]: adaptVenueMapModule,
  [ContentTypes.VIDEO_CAROUSEL]: adaptVideoCarouselModule,
  [ContentTypes.TRENDS]: adaptTrendsModule,
}
