import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { BicolorIdCardError } from 'ui/svg/icons/BicolorIdCardError'
import { IconInterface } from 'ui/svg/icons/types'
import { Spacer, Typo } from 'ui/theme'

export function IdentityCheckPending() {
  return (
    <GenericInfoPage
      title="Oups&nbsp;!"
      icon={IdCardError}
      buttons={[
        <TouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording="Retourner à l’accueil"
          navigateTo={navigateToHomeConfig}
        />,
      ]}>
      <StyledBody>
        Il y a déjà une demande de crédit pass Culture en cours sur ton compte.
      </StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>
        Ton inscription est en cours de vérification. Tu recevras une notification dès que ton
        dossier sera validé.
      </StyledBody>
    </GenericInfoPage>
  )
}

const IdCardError: React.FC<IconInterface> = (props) => <BicolorIdCardError {...props} />

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
