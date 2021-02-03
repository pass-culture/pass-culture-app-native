import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import GestureRecognizer from 'react-native-swipe-gestures'
import styled from 'styled-components/native'

import { GenericTutorial } from 'features/firstLogin/tutorials/components/GenericTutorial'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import TutorialOffers from 'ui/animations/tutorial_offers.json'
import { getSpacing } from 'ui/theme'

export function SecondTutorial() {
  const { navigate } = useNavigation<UseNavigationType>()

  function onSwipeLeft() {
    navigate('ThirdTutorial')
  }

  const onSwipeRight = () => {
    navigate('FirstTutorial')
  }

  function goToThirdTutorial() {
    navigate('ThirdTutorial')
  }

  return (
    <StyledGestureRecognizer
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      config={{
        velocityThreshold: 0.03,
        directionalOffsetThreshold: 400,
        gestureIsClickThreshold: 0.1,
      }}>
      <GenericTutorial
        animation={TutorialOffers}
        animationSize={getSpacing(60)}
        buttonCallback={goToThirdTutorial}
        buttonText={_(t`Continuer`)}
        pauseAnimationOnRenderAtFrame={62}
        step={2}
        subTitle={_(t`et si tu es...`)}
        text={_(
          t`dans l’année de tes 18 ans, obtiens l’aide financière pass Culture d’un montant de 300€ à dépenser dans l’application.`
        )}
        title={_(t`Des offres pour tous`)}
      />
    </StyledGestureRecognizer>
  )
}

const StyledGestureRecognizer = styled(GestureRecognizer)({
  flexGrow: 1,
})
