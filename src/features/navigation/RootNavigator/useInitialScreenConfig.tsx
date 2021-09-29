import { useEffect } from 'react'

import { api } from 'api/api'
import { ScreenConfiguration } from 'features/deeplinks/types'
import { analytics } from 'libs/analytics'
import { useSafeState } from 'libs/hooks'
import { storage } from 'libs/storage'

import { homeNavigateConfig } from '../helpers'

import { RootScreenNames } from './types'

export type InitialScreenConfiguration =
  | ScreenConfiguration<'EighteenBirthday'>
  | ScreenConfiguration<'CulturalSurvey'>
  | ScreenConfiguration<'TabNavigator'>
  | ScreenConfiguration<'FirstTutorial'>

export function useInitialScreen(): RootScreenNames | undefined {
  const [initialScreen, setInitialScreen] = useSafeState<RootScreenNames | undefined>(undefined)

  useEffect(() => {
    getInitialScreen().then((screen) => {
      setInitialScreen(screen)
      triggerInitialScreenNameAnalytics(screen)
    })
  }, [])

  return initialScreen
}

async function getInitialScreen(): Promise<RootScreenNames> {
  try {
    const user = await api.getnativev1me()
    const hasSeenEligibleCard = !!(await storage.readObject('has_seen_eligible_card'))
    if (!hasSeenEligibleCard && user.showEligibleCard) {
      return 'EighteenBirthday'
    }
    if (user.isBeneficiary && user.needsToFillCulturalSurvey) {
      return 'CulturalSurvey'
    }
  } catch {
    // If we cannot get the user's information or have an error with the storage,
    // we do as if the user is not logged in
  }

  try {
    const hasSeenTutorials = !!(await storage.readObject('has_seen_tutorials'))
    if (hasSeenTutorials) {
      return homeNavigateConfig.screen
    }
  } catch {
    // In case we have an error with the storage, we go to the home
    return homeNavigateConfig.screen
  }

  return 'FirstTutorial'
}

function triggerInitialScreenNameAnalytics(screenName: RootScreenNames) {
  if (screenName === 'TabNavigator') {
    analytics.logScreenView('Home')
  } else {
    analytics.logScreenView(screenName)
  }
}
