import { useEffect } from 'react'
import { Platform } from 'react-native'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { analytics } from 'libs/analytics'
import { useSafeState } from 'libs/hooks'
import { storage } from 'libs/storage'
import { useShouldShowCulturalSurvey } from 'shared/culturalSurvey/useShouldShowCulturalSurvey'

import { homeNavConfig } from '../TabBar/helpers'

import { RootScreenNames } from './types'

export function useInitialScreen(): RootScreenNames | undefined {
  const { isLoggedIn, user } = useAuthContext()
  const shouldShowCulturalSurvey = useShouldShowCulturalSurvey()

  const [initialScreen, setInitialScreen] = useSafeState<RootScreenNames | undefined>(undefined)

  useEffect(() => {
    const showCulturalSurvey = shouldShowCulturalSurvey(user)

    if (showCulturalSurvey === undefined) return

    getInitialScreen({ isLoggedIn, showCulturalSurvey })
      .then((screen) => {
        setInitialScreen(screen)
        triggerInitialScreenNameAnalytics(screen)
      })
      .catch(() => {
        setInitialScreen('TabNavigator')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user, shouldShowCulturalSurvey])

  return initialScreen
}

async function getInitialScreen({
  isLoggedIn,
  showCulturalSurvey,
}: {
  isLoggedIn: boolean
  showCulturalSurvey: boolean
}): Promise<RootScreenNames> {
  if (isLoggedIn) {
    try {
      const user = await api.getNativeV1Me()

      if (user.recreditAmountToShow) {
        return 'RecreditBirthdayNotification'
      }

      const hasSeenEligibleCard = !!(await storage.readObject('has_seen_eligible_card'))
      if (!hasSeenEligibleCard && user.showEligibleCard) {
        return 'EighteenBirthday'
      }
      if (showCulturalSurvey) {
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

  return 'OnboardingWelcome'
}

function triggerInitialScreenNameAnalytics(screenName: RootScreenNames) {
  if (screenName === 'TabNavigator') {
    analytics.logScreenView('Home')
  } else {
    analytics.logScreenView(screenName)
  }
}
