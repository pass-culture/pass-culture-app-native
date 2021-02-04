import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { GenericTutorial } from 'features/firstLogin/tutorials/components/GenericTutorial'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import TutorialPassLogo from 'ui/animations/tutorial_pass_logo.json'

import { TutorialSwiper } from '../components/TutorialSwiper'

export function FirstTutorial() {
  const { navigate } = useNavigation<UseNavigationType>()

  function onSwipeLeft() {
    navigate('SecondTutorial')
  }

  function onButtonPress() {
    navigate('SecondTutorial')
  }

  return (
    <TutorialSwiper onSwipeLeft={onSwipeLeft}>
      <GenericTutorial
        animation={TutorialPassLogo}
        buttonCallback={onButtonPress}
        buttonText={_(t`Continuer`)}
        pauseAnimationOnRenderAtFrame={62}
        step={1}
        subTitle={_(t`c'est...`)}
        text={_(t`une initiative financée par le Ministère de la Culture.`)}
        title={_(t`Le pass Culture`)}
      />
    </TutorialSwiper>
  )
}
