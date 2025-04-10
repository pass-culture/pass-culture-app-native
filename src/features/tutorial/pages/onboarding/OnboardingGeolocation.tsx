import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { TutorialTypes } from 'features/tutorial/enums'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location'
import GeolocationAnimation from 'ui/animations/geolocalisation.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'

export const OnboardingGeolocation = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { requestGeolocPermission } = useLocation()

  const navigateToNextScreen = useCallback(() => {
    navigate('AgeSelectionFork', { type: TutorialTypes.ONBOARDING })
  }, [navigate])

  const onSkip = useCallback(() => {
    analytics.logOnboardingGeolocationClicked({ type: 'skipped' })
    navigateToNextScreen()
  }, [navigateToNextScreen])

  const onGeolocationButtonPress = useCallback(async () => {
    analytics.logOnboardingGeolocationClicked({ type: 'use_my_position' })
    await requestGeolocPermission({
      onSubmit: navigateToNextScreen,
      onAcceptance: analytics.logHasActivateGeolocFromTutorial,
    })
  }, [navigateToNextScreen, requestGeolocPermission])

  return (
    <GenericInfoPage
      withSkipAction={onSkip}
      animation={GeolocationAnimation}
      title="Découvre les offres près de chez toi"
      subtitle="Librairie, ciné, festival... Active ta géolocalisation pour retrouver les offres culturelles à proximité."
      buttonPrimary={{
        wording: 'Utiliser ma position',
        onPress: onGeolocationButtonPress,
      }}
    />
  )
}
