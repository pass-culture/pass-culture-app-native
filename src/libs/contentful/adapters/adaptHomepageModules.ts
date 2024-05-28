import isEmpty from 'lodash/isEmpty'

import { HomepageModule } from 'features/home/types'
import { adaptAppV2VenuesModule } from 'libs/contentful/adapters/modules/adaptAppV2VenuesModule'
import { adaptBusinessModule } from 'libs/contentful/adapters/modules/adaptBusinessModule'
import { adaptCategoryListModule } from 'libs/contentful/adapters/modules/adaptCategoryListModule'
import { adaptExclusivityModule } from 'libs/contentful/adapters/modules/adaptExclusivityModule'
import { adaptHighlightOfferModule } from 'libs/contentful/adapters/modules/adaptHighlightOfferModule'
import { adaptOffersModule } from 'libs/contentful/adapters/modules/adaptOffersModule'
import { adaptRecommendationModule } from 'libs/contentful/adapters/modules/adaptRecommendationModule'
import { adaptThematicHighlightModule } from 'libs/contentful/adapters/modules/adaptThematicHighlightModule'
import { adaptVenueMapModule } from 'libs/contentful/adapters/modules/adaptVenueMapModule'
import { adaptVenuesModule } from 'libs/contentful/adapters/modules/adaptVenuesModule'
import { adaptVideoCarouselModule } from 'libs/contentful/adapters/modules/adaptVideoCarouselModule'
import { adaptVideoModule } from 'libs/contentful/adapters/modules/adaptVideoModule'
import {
  HomepageNatifModule,
  isAlgoliaContentModel,
  isAppV2VenuesContentModel,
  isBusinessContentModel,
  isCategoryListContentModel,
  isExclusivityContentModel,
  isHighlightOfferContentModel,
  isRecommendationContentModel,
  isThematicHighlightContentModel,
  isVenueMapBlockContentModel,
  isVenuesContentModel,
  isVideoCarouselContentModel,
  isVideoContentModel,
} from 'libs/contentful/types'
import { eventMonitoring } from 'libs/monitoring'

export const adaptHomepageNatifModules = (modules: HomepageNatifModule[]): HomepageModule[] => {
  const adaptedHomepageNatifModules = modules.map((module) => {
    const { fields } = module
    if (!fields || isEmpty(fields)) return null

    try {
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

      if (isAppV2VenuesContentModel(module)) {
        return adaptAppV2VenuesModule(module)
      }

      if (isExclusivityContentModel(module)) {
        return adaptExclusivityModule(module)
      }

      if (isCategoryListContentModel(module)) {
        return adaptCategoryListModule(module)
      }

      if (isVideoContentModel(module)) {
        return adaptVideoModule(module)
      }

      if (isHighlightOfferContentModel(module)) {
        return adaptHighlightOfferModule(module)
      }

      if (isVenueMapBlockContentModel(module)) {
        return adaptVenueMapModule(module)
      }

      if (isVideoCarouselContentModel(module)) {
        return adaptVideoCarouselModule(module)
      }
    } catch (error) {
      console.warn(`Error while computing home modules, with module of ID: ${module.sys.id}`, error)
      eventMonitoring.captureException('Error while computing home modules', {
        extra: { moduleId: module.sys.id },
      })
    }

    return null
  })

  const adaptedHomepageNatifModulesWithoutNull = adaptedHomepageNatifModules.filter(
    (module) => module != null
  ) as HomepageModule[]

  return adaptedHomepageNatifModulesWithoutNull
}
