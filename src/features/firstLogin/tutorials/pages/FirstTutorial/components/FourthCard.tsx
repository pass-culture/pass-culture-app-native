import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { CardKey, GenericCard } from 'features/firstLogin/tutorials/components/GenericCard'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { storage } from 'libs/storage'
import StarAnimation from 'ui/animations/tutorial_star.json'

export function FourthCard(props: CardKey) {
  const { navigate } = useNavigation<UseNavigationType>()

  useEffect(() => {
    storage.saveObject('has_seen_tutorials', true)
  }, [])

  function onButtonPress() {
    navigate('TabNavigator')
  }

  return (
    <GenericCard
      animation={StarAnimation}
      buttonCallback={onButtonPress}
      buttonText={_(t`Découvrir`)}
      pauseAnimationOnRenderAtFrame={62}
      subTitle={_(t`quotidiennes`)}
      text={_(
        t`Nos nombreux partenaires ajoutent de nouvelles offres quotidiennement. Découvre les dès maintenant !`
      )}
      title={_(t`Des nouveautés`)}
      {...props}
    />
  )
}
