import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { SadFace } from 'ui/svg/icons/SadFace'
import { Typo } from 'ui/theme'

export const IncorrectLink = () => (
  <GenericInfoPage
    illustration={SadFace}
    title="Oups, ce lien semble incorrect"
    buttonPrimary={{ wording: 'Revenir au catalogue', navigateTo: navigateToHomeConfig }}>
    <StyledBody>
      Nous ne pouvons pas te rediriger vers cette page. Vérifie le lien ou retourne simplement à
      l’accueil.
    </StyledBody>
  </GenericInfoPage>
)

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.designSystem.size.spacing.l,
}))
