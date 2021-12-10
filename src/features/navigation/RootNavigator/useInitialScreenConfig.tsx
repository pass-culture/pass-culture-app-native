import { useEffect } from 'react'

import { api } from 'api/api'
import { SettingsResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useAppSettings } from 'features/auth/settings'
import { shouldShowCulturalSurvey } from 'features/firstLogin/shouldShowCulturalSurvey'
import { analytics } from 'libs/analytics'
import { useSafeState } from 'libs/hooks'
import { storage } from 'libs/storage'

import { homeNavConfig } from '../TabBar/helpers'

import { RootScreenNames } from './types'

export function useInitialScreen(): RootScreenNames | undefined {
  const { isLoggedIn } = useAuthContext()

  const [initialScreen, setInitialScreen] = useSafeState<RootScreenNames | undefined>(undefined)
  const { data: settings } = useAppSettings()

  useEffect(() => {
    getInitialScreen({ isLoggedIn, settings })
      .then((screen) => {
        setInitialScreen(screen)
        triggerInitialScreenNameAnalytics(screen)
      })
      .catch(() => {
        setInitialScreen('TabNavigator')
      })
  }, [isLoggedIn])

  return initialScreen
}

async function getInitialScreen({
  isLoggedIn,
  settings,
}: {
  isLoggedIn: boolean
  settings: SettingsResponse | undefined
}): Promise<RootScreenNames> {
  if (isLoggedIn) {
    try {
      const user = await api.getnativev1me()
      const hasSeenEligibleCard = !!(await storage.readObject('has_seen_eligible_card'))
      if (!hasSeenEligibleCard && user.showEligibleCard) return 'EighteenBirthday'
      if (shouldShowCulturalSurvey(user, settings)) return 'CulturalSurvey'
    } catch {
      // If we cannot get user's information, we just go to the homepage
      return homeNavConfig[0]
    }
  }

  try {
    const hasSeenTutorials = !!(await storage.readObject('has_seen_tutorials'))
    if (hasSeenTutorials) {
      return homeNavConfig[0]
    }
  } catch {
    return homeNavConfig[0]
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
