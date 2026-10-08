import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { Typo } from 'ui/theme'

export const OneTimePasswordLimit = () => {
  const duration = '30 minutes'
  const subtitle = `Tu as saisi plusieurs codes incorrects d’affilée. Par mesure de sécurité, l’accès à ton compte est suspendu pendant `

  return (
    <GenericInfoPage
      illustration={ProfileDeletion}
      title="Limite d’essais atteinte"
      buttonPrimary={{
        wording: 'Retourner à la connexion',
        navigateTo: { screen: 'Login', params: {} },
      }}
      buttonSecondary={{
        wording: 'Aller à l’accueil',
        navigateTo: navigateToHomeConfig,
      }}>
      <StyledBody>
        {subtitle}
        <Typo.Button>{duration}</Typo.Button>
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.designSystem.size.spacing.l,
}))
