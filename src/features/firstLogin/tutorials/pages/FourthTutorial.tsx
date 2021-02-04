import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { GenericTutorial } from 'features/firstLogin/tutorials/components/GenericTutorial'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import StarAnimation from 'ui/animations/tutorial_star.json'
import { getSpacing } from 'ui/theme'

export function FourthTutorial() {
  const { navigate } = useNavigation<UseNavigationType>()

  function onButtonPress() {
    navigate('TabNavigator')
  }

  return (
    <GenericTutorial
      animation={StarAnimation}
      animationSize={getSpacing(60)}
      buttonCallback={onButtonPress}
      buttonText={_(t`Découvrir`)}
      pauseAnimationOnRenderAtFrame={62}
      step={4}
      subTitle={_(t`quotidiennes`)}
      text={_(
        t`Nos nombreux partenaires ajoutent de nouvelles offres quotidiennement. Découvre les dès maintenant !`
      )}
      title={_(t`Des nouveautés`)}
    />
  )
}
