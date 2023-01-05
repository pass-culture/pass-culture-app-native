import isEmpty from 'lodash/isEmpty'

import { HomepageModule } from 'features/home/types'
import { adaptBusinessModule } from 'libs/contentful/adapters/modules/adaptBusinessModule'
import { adaptCategoryListModule } from 'libs/contentful/adapters/modules/adaptCategoryListModule'
import { adaptExclusivityModule } from 'libs/contentful/adapters/modules/adaptExclusivityModule'
import { adaptOffersModule } from 'libs/contentful/adapters/modules/adaptOffersModule'
import { adaptRecommendationModule } from 'libs/contentful/adapters/modules/adaptRecommendationModule'
import { adaptThematicHighlightModule } from 'libs/contentful/adapters/modules/adaptThematicHighlightModule'
import { adaptVenuesModule } from 'libs/contentful/adapters/modules/adaptVenuesModule'
import {
  isAlgoliaContentModel,
  HomepageNatifModule,
  isBusinessContentModel,
  isRecommendationContentModel,
  isVenuesContentModel,
  isExclusivityContentModel,
  isThematicHighlightContentModel,
  isCategoryListContentModel,
} from 'libs/contentful/types'

export const adaptHomepageNatifModules = (modules: HomepageNatifModule[]): HomepageModule[] => {
  const adaptedHomepageNatifModules = modules.map((module) => {
    const { fields } = module
    if (!fields || isEmpty(fields)) return null

    if (isAlgoliaContentModel(module)) {
      return adaptOffersModule(module)
    }

    if (isBusinessContentModel(module)) {
      return adaptBusinessModule(module)
    }

    if (isRecommendationContentModel(module)) {
      return adaptRecommendationModule(module)
    }

    if (isThematicHighlightContentModel(module)) {
      return adaptThematicHighlightModule(module)
    }

    if (isVenuesContentModel(module)) {
      return adaptVenuesModule(module)
    }

    if (isExclusivityContentModel(module)) {
      return adaptExclusivityModule(module)
    }

    if (isCategoryListContentModel(module)) {
      return adaptCategoryListModule(module)
    }

    return null
  })

  const adaptedHomepageNatifModulesWithoutNull = adaptedHomepageNatifModules.filter(
    (module) => module != null
  ) as HomepageModule[]

  return adaptedHomepageNatifModulesWithoutNull
}
