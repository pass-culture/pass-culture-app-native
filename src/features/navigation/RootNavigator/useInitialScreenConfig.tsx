import { useEffect } from 'react'
import { Platform } from 'react-native'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { performanceMonitoringStoreActions } from 'features/home/pages/helpers/usePerformanceMonitoringStore'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { analytics } from 'libs/analytics/provider'
import { useSafeState } from 'libs/hooks'
import { storage } from 'libs/storage'

import { RootScreenNames } from './types'

export function useInitialScreen(): RootScreenNames | undefined {
  const { isLoggedIn, user } = useAuthContext()

  const [initialScreen, setInitialScreen] = useSafeState<RootScreenNames | undefined>(undefined)

  useEffect(() => {
    getInitialScreen({ isLoggedIn, user })
      .then((screen) => {
        setInitialScreen(screen)
        triggerInitialScreenNameAnalytics(screen)
      })
      .catch(() => {
        setInitialScreen('OnboardingStackNavigator')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user])

  initialScreen && performanceMonitoringStoreActions.setInitialScreenName(initialScreen)
  return initialScreen
}

async function getInitialScreen({
  isLoggedIn,
  user,
}: {
  isLoggedIn: boolean
  user?: UserProfileResponse
}): Promise<RootScreenNames> {
  if (isLoggedIn && user) {
    try {
      if (user.recreditAmountToShow) {
        return 'RecreditBirthdayNotification'
      }

      const hasSeenEligibleCard = !!(await storage.readObject('has_seen_eligible_card'))
      if (!hasSeenEligibleCard && user.showEligibleCard) {
        return 'EighteenBirthday'
      }
      // If user closed app after completing activation
      if (user?.needsToFillCulturalSurvey) {
        return 'CulturalSurveyIntro'
      }
    } catch {
      // If we cannot get user's information, we just go to the homepage
      return homeNavConfig[0]
    }
  }

  try {
    const hasSeenTutorials = !!(await storage.readObject('has_seen_tutorials'))
    if (hasSeenTutorials || Platform.OS === 'web') {
      return homeNavConfig[0]
    }
  } catch {
    return homeNavConfig[0]
  }

  return 'OnboardingStackNavigator'
}

function triggerInitialScreenNameAnalytics(screenName: RootScreenNames) {
  if (screenName === 'TabNavigator') {
    analytics.logScreenView('Home')
  } else {
    analytics.logScreenView(screenName)
  }
}
