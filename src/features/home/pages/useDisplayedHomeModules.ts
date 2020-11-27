import { useAuthContext } from 'features/auth/AuthContext'

import { useHomepageModules } from '../api'

import { getModulesToDisplay, getOfferModules } from './useDisplayedHomeModules.utils'
import { useHomeAlgoliaModules } from './useHomeAlgoliaModules'

export function useDisplayedHomeModules() {
  const { isLoggedIn } = useAuthContext()

  // 1. Get the list of modules from contentful
  const { data: modules = [] } = useHomepageModules()

  // 2. Get the hits and nbHits for each algolia module
  const algoliaModules = useHomeAlgoliaModules(getOfferModules(modules))

  // 3. Reconcile the two and filter the modules that will eventually be displayed
  const displayedModules = getModulesToDisplay(modules, algoliaModules, isLoggedIn)
  return { algoliaModules, displayedModules }
}
