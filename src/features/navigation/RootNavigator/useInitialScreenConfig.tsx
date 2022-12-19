import { useEffect } from 'react'
import { Platform } from 'react-native'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/AuthContext'
import {
  shouldShowCulturalSurvey,
  useCulturalSurveyRoute,
} from 'features/culturalSurvey/helpers/utils'
import { analytics } from 'libs/firebase/analytics'
import { useSafeState } from 'libs/hooks'
import { storage } from 'libs/storage'

import { homeNavConfig } from '../TabBar/helpers'

import { RootScreenNames } from './types'

export function useInitialScreen(): RootScreenNames | undefined {
  const { isLoggedIn } = useAuthContext()
  const culturalSurveyRoute = useCulturalSurveyRoute()

  const [initialScreen, setInitialScreen] = useSafeState<RootScreenNames | undefined>(undefined)

  useEffect(() => {
    getInitialScreen({ isLoggedIn, culturalSurveyRoute })
      .then((screen) => {
        setInitialScreen(screen)
        triggerInitialScreenNameAnalytics(screen)
      })
      .catch(() => {
        setInitialScreen('TabNavigator')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, culturalSurveyRoute])

  return initialScreen
}

async function getInitialScreen({
  isLoggedIn,
  culturalSurveyRoute,
}: {
  isLoggedIn: boolean
  culturalSurveyRoute: 'CulturalSurveyIntro' | 'CulturalSurvey'
}): Promise<RootScreenNames> {
  if (isLoggedIn) {
    try {
      const user = await api.getnativev1me()

      if (user.recreditAmountToShow) {
        return 'RecreditBirthdayNotification'
      }

      const hasSeenEligibleCard = !!(await storage.readObject('has_seen_eligible_card'))
      if (!hasSeenEligibleCard && user.showEligibleCard) {
        return 'EighteenBirthday'
      }
      if (shouldShowCulturalSurvey(user)) {
        return culturalSurveyRoute
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

  return 'OnboardingWelcome'
}

function triggerInitialScreenNameAnalytics(screenName: RootScreenNames) {
  if (screenName === 'TabNavigator') {
    analytics.logScreenView('Home')
  } else {
    analytics.logScreenView(screenName)
  }
}
