import { useEffect } from 'react'
import { Platform } from 'react-native'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { initialScreenNameActions } from 'features/home/pages/helpers/useInitialScreenNameStore'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { analytics } from 'libs/analytics/provider'
import { useSafeState } from 'libs/hooks'
import { storage } from 'libs/storage'
import { useShouldShowCulturalSurveyForBeneficiaryUser } from 'shared/culturalSurvey/useShouldShowCulturalSurveyForBeneficiaryUser'

import { RootScreenNames } from './types'

export function useInitialScreen(): RootScreenNames | undefined {
  const { isLoggedIn, user } = useAuthContext()
  const shouldShowCulturalSurvey = useShouldShowCulturalSurveyForBeneficiaryUser()

  const [initialScreen, setInitialScreen] = useSafeState<RootScreenNames | undefined>(undefined)

  useEffect(() => {
    const showCulturalSurvey = shouldShowCulturalSurvey(user)

    if (showCulturalSurvey === undefined) return

    getInitialScreen({ isLoggedIn, showCulturalSurvey, user })
      .then((screen) => {
        setInitialScreen(screen)
        triggerInitialScreenNameAnalytics(screen)
      })
      .catch(() => {
        setInitialScreen('OnboardingStackNavigator')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user, shouldShowCulturalSurvey])

  initialScreen && initialScreenNameActions.setInitialScreenName(initialScreen)
  return initialScreen
}

async function getInitialScreen({
  isLoggedIn,
  showCulturalSurvey,
  user,
}: {
  isLoggedIn: boolean
  showCulturalSurvey: boolean
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

  return 'OnboardingStackNavigator'
}

function triggerInitialScreenNameAnalytics(screenName: RootScreenNames) {
  if (screenName === 'TabNavigator') {
    analytics.logScreenView('Home')
  } else {
    analytics.logScreenView(screenName)
  }
}
