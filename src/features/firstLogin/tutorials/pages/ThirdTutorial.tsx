import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { GenericTutorial } from 'features/firstLogin/tutorials/components/GenericTutorial'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useGeolocation } from 'libs/geolocation'
import { _ } from 'libs/i18n'
import GeolocationAnimation from 'ui/animations/geolocalisation.json'

export function ThirdTutorial() {
  const { navigate } = useNavigation<UseNavigationType>()
  const { requestGeolocPermission } = useGeolocation()

  function onSwipeLeft() {
    navigate('FourthTutorial')
  }

  function onSwipeRight() {
    navigate('SecondTutorial')
  }

  async function onGeolocationButtonPress() {
    await requestGeolocPermission({
      onSubmit: () => {
        navigate('FourthTutorial')
      },
    })
  }

  return (
    <GenericTutorial
      animation={GeolocationAnimation}
      buttonCallback={onGeolocationButtonPress}
      buttonText={_(t`Activer la géolocalisation`)}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      pauseAnimationOnRenderAtFrame={62}
      step={3}
      subTitle={_(t`à portée de main !`)}
      text={_(
        t`Active la géolocalisation pour découvrir toutes les offres existantes autour de toi.`
      )}
      title={_(t`Toute la culture`)}
    />
  )
}
