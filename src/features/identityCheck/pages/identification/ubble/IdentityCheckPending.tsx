import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { IdCardError } from 'ui/svg/icons/IdCardError'
import { Spacer, Typo } from 'ui/theme'

export function IdentityCheckPending() {
  return (
    <GenericInfoPage
      title={t`Oups\u00a0!`}
      icon={IdCardError}
      buttons={[
        <TouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording={t`Retourner à l'accueil`}
          navigateTo={navigateToHomeConfig}
        />,
      ]}>
      <StyledBody>{t`Il y a déjà une demande de crédit pass Culture en cours sur ton compte.`}</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>{t`Ton inscription est en cours de vérification. Tu recevras une notification dès que ton dossier sera validé.`}</StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
