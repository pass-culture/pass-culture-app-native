import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorIdCardError } from 'ui/svg/icons/BicolorIdCardError'
import { Typo } from 'ui/theme'

export function IdentityCheckPending() {
  return (
    <GenericInfoPageWhite
      illustration={BicolorIdCardError}
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
    </GenericInfoPageWhite>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
