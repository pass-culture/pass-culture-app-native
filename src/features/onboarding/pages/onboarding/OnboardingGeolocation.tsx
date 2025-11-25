import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { getOnboardingHookConfig } from 'features/navigation/navigators/OnboardingStackNavigator/getOnboardingHookConfig'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location/location'
import Geolocation from 'ui/animations/geolocalisation.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'

export const OnboardingGeolocation = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { requestGeolocPermission } = useLocation()

  const navigateToNextScreen = useCallback(() => {
    navigate(...getOnboardingHookConfig('OnboardingAgeSelectionFork'))
  }, [navigate])

  const onGeolocationButtonPress = useCallback(async () => {
    await requestGeolocPermission({
      onSubmit: navigateToNextScreen,
      onAcceptance: analytics.logHasActivateGeolocFromTutorial,
    })
  }, [navigateToNextScreen, requestGeolocPermission])

  return (
    <GenericInfoPage
      animation={Geolocation}
      animationColoringMode="targeted"
      animationTargetShapeNames={['Fond 1', 'Gradient Fill 1']}
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
