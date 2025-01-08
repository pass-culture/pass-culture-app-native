import React from 'react'
import styled from 'styled-components/native'

import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

export const ABTestingPOC: React.FC = () => {
  const { test_param } = useRemoteConfigContext()

  const message = `test_param value is ${test_param}`
  const instructionsText =
    'Voir les expériences sur la console Firebase\u00a0: > Menu "Engager" de la barre de gauche > Cliquer sur le bouton "A/B testing" > Cliquer sur un des onglets selon l’état du test > Cliquer sur le test'
  return (
    <StyledView>
      <TypoDS.Title2>{message}</TypoDS.Title2>
      <Spacer.Column numberOfSpaces={5} />
      <TypoDS.Body>{instructionsText}</TypoDS.Body>
    </StyledView>
  )
}

const StyledView = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: getSpacing(6),
})
