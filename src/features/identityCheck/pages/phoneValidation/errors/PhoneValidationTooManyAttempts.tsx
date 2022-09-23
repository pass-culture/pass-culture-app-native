import React from 'react'
import styled from 'styled-components/native'

import { contactSupport } from 'features/auth/support.services'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Email } from 'ui/svg/icons/Email'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'
import { Typo } from 'ui/theme'

export function PhoneValidationTooManyAttempts() {
  return (
    <GenericInfoPage
      title="Trop de tentatives&nbsp;!"
      icon={UserBlocked}
      buttons={[
        <TouchableLink
          as={ButtonTertiaryWhite}
          key={1}
          wording="Contacter le support"
          accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support"
          icon={Email}
          externalNav={contactSupport.forPhoneNumberConfirmation}
        />,
        <TouchableLink
          key={2}
          as={ButtonPrimaryWhite}
          wording="Retourner à l’accueil"
          navigateTo={navigateToHomeConfig}
        />,
      ]}>
      <StyledBody>
        Tu as dépassé le nombre d’essais autorisés. L’accès à ton crédit pass Culture a été bloqué.
        Pour le récupérer tu peux contacter le support.
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
