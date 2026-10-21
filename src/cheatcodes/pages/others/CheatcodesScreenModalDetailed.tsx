import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { ModalDetailed } from 'ui/designSystem/ModalDetailed/ModalDetailed'
import { CloseFilled } from 'ui/svg/icons/CloseFilled'
import { Typo } from 'ui/theme'

export const CheatcodesScreenModalDetailed = () => {
  const { goBack } = useNavigation<UseNavigationType>()

  return (
    <ModalDetailed
      title="Titre très très très loong Titre très très très loong Titre très très très loong"
      description="Ceci est une description qui peut être assez longue en fonction du contenu de la page. Il n’y a pas de limites en termes de nombre de lignes…"
      onClose={goBack}
      onGoBack={goBack}
      hasFixedFooter
      buttonsDescription="Message précisant le bouton"
      primaryButton={{
        wording: 'Primary',
        accessibilityLabel: 'Action principale',
        icon: CloseFilled,
        onPress: goBack,
      }}
      secondaryButton={{
        wording: 'Secondary',
        accessibilityLabel: 'Action secondaire',
        icon: CloseFilled,
        onPress: goBack,
      }}
      tertiaryButton={{
        wording: 'Tertiary',
        accessibilityLabel: 'Action tertiaire',
        icon: CloseFilled,
        onPress: goBack,
      }}>
      <ChildrenPlaceholder>
        <Typo.Body>Début du children</Typo.Body>
        <Typo.Body>Fin du children</Typo.Body>
      </ChildrenPlaceholder>
    </ModalDetailed>
  )
}

const ChildrenPlaceholder = styled.View(({ theme }) => ({
  width: '100%',
  height: 1200,
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.designSystem.color.background.decorative04,
}))
