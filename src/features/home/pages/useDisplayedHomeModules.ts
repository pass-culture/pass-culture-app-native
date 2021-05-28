import { useAuthContext } from 'features/auth/AuthContext'
import { useHomepageModules } from 'features/home/api'

import { getModulesToDisplay, getRecommendationModule } from './useDisplayedHomeModules.utils'
import { useHomeRecommendedHits } from './useHomeRecommendedHits'

export function useDisplayedHomeModules() {
  const { isLoggedIn } = useAuthContext()

  // 1. Get the list of modules from contentful
  const { data: modules = [] } = useHomepageModules()

  // 2. Get the offers for the recommended hits
  const recommendedHits = useHomeRecommendedHits(getRecommendationModule(modules))

  // 3. Filter the modules that will eventually be displayed
  const displayedModules = getModulesToDisplay(modules, isLoggedIn)
  return { displayedModules, recommendedHits }
}
