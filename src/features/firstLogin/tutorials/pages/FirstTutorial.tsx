import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Alert } from 'react-native'
import GestureRecognizer from 'react-native-swipe-gestures'

import { GenericTutorial } from 'features/firstLogin/tutorials/components/GenericTutorial'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import TutorialPassLogo from 'ui/animations/tutorial_pass_logo.json'
import { getSpacing } from 'ui/theme'

export function FirstTutorial() {
  const { navigate } = useNavigation<UseNavigationType>()

  const onSwipeLeft = (gestureState) => {
    navigate('SecondTutorial')
  }

  function goToSecondTutorial() {
    Alert.alert('TODO: PC-5960')
  }

  return (
    <GestureRecognizer
      onSwipeLeft={onSwipeLeft}
      config={{
        velocityThreshold: 0.03,
        directionalOffsetThreshold: 400,
        gestureIsClickThreshold: 0.1,
      }}
      style={{
        flexGrow: 1,
      }}>
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
    </GestureRecognizer>
  )
}
