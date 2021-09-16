import { useAuthContext } from 'features/auth/AuthContext'
import { useHomepageModules } from 'features/home/api'
import { useHomeVenueModules } from 'features/home/pages/useHomeVenueModules'

import {
  getModulesToDisplay,
  getOfferModules,
  getVenueModules,
  getRecommendationModule,
} from './useDisplayedHomeModules.utils'
import { useHomeModules } from './useHomeModules'
import { useHomeRecommendedHits } from './useHomeRecommendedHits'

export function useDisplayedHomeModules(entryId?: string) {
  const { isLoggedIn } = useAuthContext()

  // 1. Get the list of modules from contentful
  const modules = useHomepageModules(entryId) || []

  // 2. Get the hits and nbHits for each home module
  const homeModules = useHomeModules(getOfferModules(modules))

  // 3. Get the hits and nbHits for each venues module
  const homeVenuesModules = useHomeVenueModules(getVenueModules(modules))

  // 4. Get the offers for the recommended hits
  const recommendedHits = useHomeRecommendedHits(getRecommendationModule(modules))

  // 5. Reconcile the three and filter the modules that will eventually be displayed
  const displayedModules = getModulesToDisplay(
    modules,
    homeModules,
    homeVenuesModules,
    recommendedHits,
    isLoggedIn
  )
  return { homeModules, homeVenuesModules, displayedModules, recommendedHits }
}
