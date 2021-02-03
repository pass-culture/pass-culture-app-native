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

export function SecondTutorial() {
  const { navigate } = useNavigation<UseNavigationType>()

  function onSwipeLeft() {
    navigate('FirstTutorial')
  }

  const onSwipeRight = (gestureState) => {
    Alert.alert('TODO: PC-5961')
  }

  return (
    <GestureRecognizer
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      config={{
        velocityThreshold: 0.03,
        directionalOffsetThreshold: 400,
        gestureIsClickThreshold: 0.1,
      }}
      style={{
        flexGrow: 1,
      }}>
      <GenericTutorial
        title={_(t`Second tutorial`)}
        subTitle={_(t`c'est...`)}
        text={_(t`une initiative financée par le Ministère de la Culture.`)}
        animation={TutorialPassLogo}
        animationSize={getSpacing(60)}
        pauseAnimationOnRenderAtFrame={62}
        currentStep={2}
      />
    </GestureRecognizer>
  )
}
