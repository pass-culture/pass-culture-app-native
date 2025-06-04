import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { getOnboardingStackConfig } from 'features/navigation/OnboardingStackNavigator/getOnboardingStackConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location'
import { useAnimationToDisplay } from 'libs/styled/useAnimationToDisplay'
import GeolocationAnimation from 'ui/animations/geolocalisation.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'

export const OnboardingGeolocation = () => {
  // TODO(PC-36293): use GeolocationAnimationDark and GeolocationAnimationLight
  const animation = useAnimationToDisplay({
    light: GeolocationAnimation,
    dark: GeolocationAnimation,
  })

  const { navigate } = useNavigation<UseNavigationType>()
  const { requestGeolocPermission } = useLocation()

  const navigateToNextScreen = useCallback(() => {
    navigate(...getOnboardingStackConfig('OnboardingAgeSelectionFork'))
  }, [navigate])

  const onGeolocationButtonPress = useCallback(async () => {
    analytics.logOnboardingGeolocationClicked({ type: 'use_my_position' })
    await requestGeolocPermission({
      onSubmit: navigateToNextScreen,
      onAcceptance: analytics.logHasActivateGeolocFromTutorial,
    })
  }, [navigateToNextScreen, requestGeolocPermission])

  return (
    <GenericInfoPage
      animation={animation}
      title="Découvre les offres près de chez toi"
      subtitle="Librairie, ciné, festival... Active ta géolocalisation pour retrouver les offres culturelles à proximité."
      buttonPrimary={{
        wording: 'Continuer',
        onPress: onGeolocationButtonPress,
        accessibilityLabel: 'Continuer vers l’étape suivante',
      }}
    />
  )
}
