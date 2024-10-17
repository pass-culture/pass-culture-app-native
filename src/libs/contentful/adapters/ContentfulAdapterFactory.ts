import { ContentTypes } from '../types'

import { adaptAppV2VenuesModule } from './modules/adaptAppV2VenuesModule'
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

export type ContentfulAdapter<Contentful, Module> = (module: Contentful) => Module | null

export const contentfulAdapters: Record<string, ContentfulAdapter<any, any>> = {
  [ContentTypes.ALGOLIA]: adaptOffersModule,
  [ContentTypes.BUSINESS]: adaptBusinessModule,
  [ContentTypes.RECOMMENDATION]: adaptRecommendationModule,
  [ContentTypes.THEMATIC_HIGHLIGHT]: adaptThematicHighlightModule,
  [ContentTypes.VENUES_PLAYLIST]: adaptVenuesModule,
  [ContentTypes.VENUES_PLAYLIST_APP_V2]: adaptAppV2VenuesModule,
  [ContentTypes.EXCLUSIVITY]: adaptExclusivityModule,
  [ContentTypes.CATEGORIES]: adaptCategoryListModule,
  [ContentTypes.VIDEO]: adaptVideoModule,
  [ContentTypes.HIGHLIGHT_OFFER]: adaptHighlightOfferModule,
  [ContentTypes.VENUE_MAP_BLOCK]: adaptVenueMapModule,
  [ContentTypes.VIDEO_CAROUSEL]: adaptVideoCarouselModule,
  [ContentTypes.TRENDS]: adaptTrendsModule,
}
