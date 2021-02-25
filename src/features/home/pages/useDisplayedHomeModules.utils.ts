import {
  BusinessPane,
  ExclusivityPane,
  Offers,
  OffersWithCover,
  ProcessedModule,
} from 'features/home/contentful'
import { isArrayOfOfferTypeguard } from 'features/home/typeguards'
import { AlgoliaHit } from 'libs/algolia'

import { RecommendationPane } from '../contentful/moduleTypes'

import { AlgoliaModuleResponse } from './useHomeAlgoliaModules'

export const showBusinessModule = (
  targetNotConnectedUsersOnly: boolean | undefined,
  connected: boolean
): boolean => {
  // Target both type of users
  if (targetNotConnectedUsersOnly === undefined) return true

  // Target only NON connected users
  if (!connected && targetNotConnectedUsersOnly) return true

  // Target only connected users
  if (connected && !targetNotConnectedUsersOnly) return true
  return false
}

export const getOfferModules = (modules: ProcessedModule[]): Array<Offers | OffersWithCover> => {
  const filteredModules = modules.filter(
    (module) => module instanceof Offers || module instanceof OffersWithCover
  )
  return isArrayOfOfferTypeguard(filteredModules) ? filteredModules : []
}

export const getRecommendationModule = (
  modules: ProcessedModule[]
): RecommendationPane | undefined =>
  modules.find((module) => module instanceof RecommendationPane) as RecommendationPane | undefined

export const getModulesToDisplay = (
  modules: ProcessedModule[],
  algoliaModules: AlgoliaModuleResponse,
  recommendedHits: AlgoliaHit[],
  isLoggedIn: boolean
) =>
  modules.filter((module: ProcessedModule) => {
    if (module instanceof BusinessPane) {
      return showBusinessModule(module.targetNotConnectedUsersOnly, isLoggedIn)
    }
    if (module instanceof ExclusivityPane) return true
    if (module instanceof RecommendationPane) {
      return recommendedHits.length > module.display.minOffers
    }

    if (module.moduleId in algoliaModules) {
      const { hits, nbHits } = algoliaModules[module.moduleId]
      return hits.length > 0 && nbHits >= module.display.minOffers
    }
    return false
  })
