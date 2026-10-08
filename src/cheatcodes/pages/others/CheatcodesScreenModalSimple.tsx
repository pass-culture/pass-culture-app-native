import React from 'react'

import { getCheatcodesHookConfig } from 'features/navigation/navigators/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { ModalSimple } from 'ui/designSystem/ModalSimple/ModalSimple'

export const CheatcodesScreenModalSimple = () => {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))

  return (
    <ModalSimple
      title="Titre très très très loong"
      illustration={{
        backgroundColor: 'positive02',
        url: remoteIllustrationUrls.validStampMosaïcLarge,
      }}
      onClose={goBack}
      description="Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max Description de 2 à 3 lignes max"
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
