import { useAuthContext } from 'features/auth/AuthContext'
import { useHomepageModules } from 'features/home/api'

import {
  getModulesToDisplay,
  getOfferModules,
  getRecommendationModule,
} from './useDisplayedHomeModules.utils'
import { useHomeModules } from './useHomeModules'
import { useHomeRecommendedHits } from './useHomeRecommendedHits'

export function useDisplayedHomeModules(entryId?: string) {
  const { isLoggedIn } = useAuthContext()

  // 1. Get the list of modules from contentful
  const { data: modules = [] } = useHomepageModules(entryId)

  // 2. Get the hits and nbHits for each algolia module
  const algoliaModules = useHomeModules(getOfferModules(modules))

  // 3. Get the offers for the recommended hits
  const recommendedHits = useHomeRecommendedHits(getRecommendationModule(modules))

  // 4. Reconcile the three and filter the modules that will eventually be displayed
  const displayedModules = getModulesToDisplay(modules, algoliaModules, recommendedHits, isLoggedIn)
  return { algoliaModules, displayedModules, recommendedHits }
}
