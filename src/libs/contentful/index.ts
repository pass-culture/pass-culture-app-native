import { env } from 'libs/environment'

import { ContentfulAdapterFactory } from './adapters/ContentfulAdapterFactory'
import { adaptAppV2VenuesModule } from './adapters/modules/adaptAppV2VenuesModule'
import { adaptBusinessModule } from './adapters/modules/adaptBusinessModule'
import { adaptCategoryListModule } from './adapters/modules/adaptCategoryListModule'
import { adaptExclusivityModule } from './adapters/modules/adaptExclusivityModule'
import { adaptHighlightOfferModule } from './adapters/modules/adaptHighlightOfferModule'
import { adaptOffersModule } from './adapters/modules/adaptOffersModule'
import { adaptRecommendationModule } from './adapters/modules/adaptRecommendationModule'
import { adaptThematicHighlightModule } from './adapters/modules/adaptThematicHighlightModule'
import { adaptTrendsModule } from './adapters/modules/adaptTrendsModule'
import { adaptVenueMapModule } from './adapters/modules/adaptVenueMapModule'
import { adaptVenuesModule } from './adapters/modules/adaptVenuesModule'
import { adaptVideoCarouselModule } from './adapters/modules/adaptVideoCarouselModule'
import { adaptVideoModule } from './adapters/modules/adaptVideoModule'
import { createContentful } from './contentful'
import { createContentfulGetHomeData } from './contentfulGetHomeData'
import { ContentTypes } from './types'

const contentfulAdapterFactory = new ContentfulAdapterFactory()
contentfulAdapterFactory.register(ContentTypes.ALGOLIA, adaptOffersModule)
contentfulAdapterFactory.register(ContentTypes.BUSINESS, adaptBusinessModule)
contentfulAdapterFactory.register(ContentTypes.RECOMMENDATION, adaptRecommendationModule)
contentfulAdapterFactory.register(ContentTypes.THEMATIC_HIGHLIGHT, adaptThematicHighlightModule)
contentfulAdapterFactory.register(ContentTypes.VENUES_PLAYLIST, adaptVenuesModule)
contentfulAdapterFactory.register(ContentTypes.VENUES_PLAYLIST_APP_V2, adaptAppV2VenuesModule)
contentfulAdapterFactory.register(ContentTypes.EXCLUSIVITY, adaptExclusivityModule)
contentfulAdapterFactory.register(ContentTypes.CATEGORIES, adaptCategoryListModule)
contentfulAdapterFactory.register(ContentTypes.VIDEO, adaptVideoModule)
contentfulAdapterFactory.register(ContentTypes.HIGHLIGHT_OFFER, adaptHighlightOfferModule)
contentfulAdapterFactory.register(ContentTypes.VENUE_MAP_BLOCK, adaptVenueMapModule)
contentfulAdapterFactory.register(ContentTypes.VIDEO_CAROUSEL, adaptVideoCarouselModule)
contentfulAdapterFactory.register(ContentTypes.TRENDS, adaptTrendsModule)

const contentful = createContentful({
  accessToken: env.CONTENTFUL_PUBLIC_ACCESS_TOKEN,
  domain: 'https://cdn.contentful.com',
  environment: env.CONTENTFUL_ENVIRONMENT,
  spaceId: env.CONTENTFUL_SPACE_ID,
})

export const contentfulGetHomeData = createContentfulGetHomeData(
  contentfulAdapterFactory,
  contentful
)
