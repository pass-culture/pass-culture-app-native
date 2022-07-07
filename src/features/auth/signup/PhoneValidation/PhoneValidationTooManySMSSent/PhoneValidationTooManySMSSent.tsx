import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'
import { Spacer, Typo } from 'ui/theme'

export function PhoneValidationTooManySMSSent() {
  return (
    <GenericInfoPage
      title={t`Réessaie plus tard`}
      icon={UserBlocked}
      buttons={[
        <TouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording={t`Retourner à l'accueil`}
          navigateTo={navigateToHomeConfig}
        />,
      ]}>
      <StyledBody>{t`Tu as dépassé le nombre de 5 demandes de code autorisées.`}</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>{t`Tu pourras réessayer dans 12 heures.`}</StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
