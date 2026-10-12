import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { ModalSimple } from 'ui/designSystem/ModalSimple/ModalSimple'

export const CheatcodesScreenModalSimpleNotScrollable = () => {
  const { goBack } = useNavigation<UseNavigationType>()

  return (
    <ModalSimple
      title="Titre très très très loong"
      illustration={{
        backgroundColor: 'positive02',
        url: remoteIllustrationUrls.validStampMosaïcLarge,
      }}
      onClose={goBack}
      description="Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max"
      primaryButton={{
        wording: 'Confirmer',
        accessibilityLabel: 'Confirmer',
        onPress: goBack,
      }}
      secondaryButton={{
        wording: 'Annuler',
        accessibilityLabel: 'Annuler',
        onPress: goBack,
      }}
      tertiaryButton={{
        wording: 'Annuler',
        accessibilityLabel: 'Annuler',
        onPress: goBack,
      }}
    />
  )
}
