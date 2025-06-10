import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { IdCardError } from 'ui/svg/icons/IdCardError'
import { Typo } from 'ui/theme'

export function IdentityCheckPending() {
  return (
    <GenericInfoPage
      illustration={IdCardError}
      title="Oups&nbsp;!"
      buttonPrimary={{
        wording: 'Retourner à l’accueil',
        navigateTo: navigateToHomeConfig,
      }}>
      <ViewGap gap={5}>
        <StyledBody>
          Il y a déjà une demande de crédit pass Culture en cours sur ton compte.
        </StyledBody>
        <StyledBody>
          Ton inscription est en cours de vérification. Tu recevras une notification dès que ton
          dossier sera validé.
        </StyledBody>
      </ViewGap>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
