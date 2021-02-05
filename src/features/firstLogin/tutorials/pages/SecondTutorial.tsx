import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { GenericTutorial } from 'features/firstLogin/tutorials/components/GenericTutorial'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import TutorialOffers from 'ui/animations/tutorial_offers.json'

export function SecondTutorial() {
  const { navigate } = useNavigation<UseNavigationType>()

  function onSwipeLeft() {
    navigate('ThirdTutorial')
  }

  function onSwipeRight() {
    navigate('FirstTutorial')
  }

  function onButtonPress() {
    navigate('ThirdTutorial')
  }

  return (
    <GenericTutorial
      animation={TutorialOffers}
      buttonCallback={onButtonPress}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      buttonText={_(t`Continuer`)}
      pauseAnimationOnRenderAtFrame={62}
      step={2}
      subTitle={_(t`et si tu es...`)}
      text={_(
        t`dans l’année de tes 18 ans, obtiens l’aide financière pass Culture d’un montant de 300€ à dépenser dans l’application.`
      )}
      title={_(t`Des offres pour tous`)}
    />
  )
}
