import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/AuthContext'
import { ScreenConfiguration } from 'features/deeplinks/types'
import { analytics } from 'libs/analytics'
import { useSplashScreenContext } from 'libs/splashscreen'
import { storage } from 'libs/storage'

import { homeNavigateConfig } from '../helpers'

import { ScreenNames, UseNavigationType } from './types'

export type InitialScreenConfiguration =
  | ScreenConfiguration<'EighteenBirthday'>
  | ScreenConfiguration<'CulturalSurvey'>
  | ScreenConfiguration<'TabNavigator'>
  | ScreenConfiguration<'FirstTutorial'>

export function useInitialScreenConfig(): void {
  const { navigate } = useNavigation<UseNavigationType>()
  const { hideSplashScreen } = useSplashScreenContext()
  const { isLoggedIn } = useAuthContext()

  const [initialScreenConfig, setInitialScreenConfig] = useState<
    InitialScreenConfiguration | undefined
  >()

  useEffect(() => {
    getInitialScreenConfig({ isLoggedIn }).then((screenConfiguration) => {
      setInitialScreenConfig(screenConfiguration)
      triggerInitialScreenNameAnalytics(screenConfiguration.screen)
    })
  }, [isLoggedIn])

  useEffect(() => {
    if (!initialScreenConfig || !hideSplashScreen) {
      return
    }
    navigate(initialScreenConfig.screen, initialScreenConfig.params)
    hideSplashScreen()
  }, [initialScreenConfig, hideSplashScreen])
}

async function getInitialScreenConfig({
  isLoggedIn,
}: {
  isLoggedIn: boolean
}): Promise<InitialScreenConfiguration> {
  if (isLoggedIn) {
    const user = await api.getnativev1me()

    const hasSeenEligibleCard = !!(await storage.readObject('has_seen_eligible_card'))
    if (!hasSeenEligibleCard && user.showEligibleCard) {
      return { screen: 'EighteenBirthday', params: undefined }
    }

    if (user.needsToFillCulturalSurvey) {
      return { screen: 'CulturalSurvey', params: undefined }
    }
  }

  const hasSeenTutorials = !!(await storage.readObject('has_seen_tutorials'))
  if (hasSeenTutorials) {
    return homeNavigateConfig
  }

  return { screen: 'FirstTutorial', params: { shouldCloseAppOnBackAction: true } }
}

function triggerInitialScreenNameAnalytics(screenName: ScreenNames) {
  if (screenName === 'TabNavigator') {
    analytics.logScreenView('Home')
  } else {
    analytics.logScreenView(screenName)
  }
}
