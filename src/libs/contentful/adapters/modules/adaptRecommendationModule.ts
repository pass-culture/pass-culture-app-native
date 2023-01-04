import omit from 'lodash/omit'

import { HomepageModuleType, RecommendedOffersModule } from 'features/home/types'
import { RecommendationContentModel } from 'libs/contentful/types'

export const adaptRecommendationModule = (
  modules: RecommendationContentModel
): RecommendedOffersModule => ({
  type: HomepageModuleType.RecommendedOffersModule,
  id: modules.sys.id,
  displayParameters: modules.fields.displayParameters.fields,
  recommendationParameters: omit(modules.fields.recommendationParameters?.fields, 'title'),
})
