import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { getOnboardingHookConfig } from 'features/navigation/navigators/OnboardingStackNavigator/getOnboardingHookConfig'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { requestGeolocPermission } from 'libs/locationV2/requestGeolocPermission'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import Geolocation from 'ui/animations/geolocalisation.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { getSpacing } from 'ui/theme'

export const OnboardingGeolocation = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToNextScreen = useCallback(() => {
    navigate(...getOnboardingHookConfig('OnboardingAgeSelectionFork'))
  }, [navigate])

  const onGeolocationButtonPress = useCallback(async () => {
    navigateToNextScreen()
    await requestGeolocPermission({
      onSuccess: analytics.logHasActivateGeolocFromTutorial,
    })
  }, [navigateToNextScreen])

  return (
    <GenericInfoPage
      animation={Geolocation}
      animationColoringMode="targeted"
      animationTargetShapeNames={['Fond 1', 'Gradient Fill 1']}
      title="Découvre les offres près de chez toi"
      subtitle="Librairie, ciné, festival... Active ta géolocalisation pour retrouver les offres culturelles à proximité."
      marginButton={useMobileFontScaleToDisplay({
        default: 0,
        at200PercentZoom: getSpacing(25),
      })}
      buttonPrimary={{
        wording: 'Continuer',
        onPress: onGeolocationButtonPress,
        accessibilityLabel: 'Continuer vers l’étape suivante',
      }}
    />
  )
}
