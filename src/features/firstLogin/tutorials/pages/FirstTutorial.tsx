import { t } from '@lingui/macro'
import React from 'react'
import { Alert } from 'react-native'

import { GenericTutorial } from 'features/firstLogin/tutorials/components/GenericTutorial'
import { _ } from 'libs/i18n'
import TutorialPassLogo from 'ui/animations/tutorial_pass_logo.json'
import { getSpacing } from 'ui/theme'

export function FirstTutorial() {
  function goToSecondTutorial() {
    Alert.alert('TODO: PC-5960')
  }

  return (
    <GenericTutorial
      animation={TutorialPassLogo}
      animationSize={getSpacing(60)}
      buttonCallback={goToSecondTutorial}
      buttonText={_(t`Continuer`)}
      pauseAnimationOnRenderAtFrame={62}
      step={1}
      subTitle={_(t`c'est...`)}
      text={_(t`une initiative financée par le Ministère de la Culture.`)}
      title={_(t`Le pass Culture`)}
    />
  )
}
