import { useEffect } from 'react'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/AuthContext'
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
  const { isLoggedIn } = useAuthContext()

  const [initialScreen, setInitialScreen] = useSafeState<RootScreenNames | undefined>(undefined)

  useEffect(() => {
    getInitialScreen({ isLoggedIn }).then((screen) => {
      setInitialScreen(screen)
      triggerInitialScreenNameAnalytics(screen)
    })
  }, [isLoggedIn])

  return initialScreen
}

async function getInitialScreen({ isLoggedIn }: { isLoggedIn: boolean }): Promise<RootScreenNames> {
  if (isLoggedIn) {
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
      // If we cannot get user's information, we just go to the homepage
      return homeNavigateConfig.screen
    }
  }

  try {
    const hasSeenTutorials = !!(await storage.readObject('has_seen_tutorials'))
    if (hasSeenTutorials) {
      return homeNavigateConfig.screen
    }
  } catch {
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
