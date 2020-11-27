import {
  BusinessPane,
  ExclusivityPane,
  Offers,
  OffersWithCover,
  ProcessedModule,
} from 'features/home/contentful'

import { isArrayOfOfferTypeguard } from '../typeguards'

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

export const getModulesToDisplay = (
  modules: ProcessedModule[],
  algoliaModules: AlgoliaModuleResponse,
  isLoggedIn: boolean
) =>
  modules.filter((module: ProcessedModule) => {
    if (module instanceof BusinessPane) {
      return showBusinessModule(module.targetNotConnectedUsersOnly, isLoggedIn)
    }
    if (module instanceof ExclusivityPane) return true

    if (module.moduleId in algoliaModules) {
      return (
        algoliaModules[module.moduleId].hits.length > 0 &&
        algoliaModules[module.moduleId].nbHits >= module.display.minOffers
      )
    }
    return false
  })
