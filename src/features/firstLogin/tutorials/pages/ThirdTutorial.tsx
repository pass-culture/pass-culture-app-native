import { t } from '@lingui/macro'
import React from 'react'
import { Alert } from 'react-native'

import { GenericTutorial } from 'features/firstLogin/tutorials/components/GenericTutorial'
import { _ } from 'libs/i18n'
import GeolocationAnimation from 'ui/animations/geolocalisation.json'
import { getSpacing } from 'ui/theme'

export function ThirdTutorial() {
  function activateGeolocation() {
    Alert.alert('TODO: PC-5962')
  }

  return (
    <GenericTutorial
      animation={GeolocationAnimation}
      animationSize={getSpacing(60)}
      buttonCallback={activateGeolocation}
      buttonText={_(t`Activer la géolocalisation`)}
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
