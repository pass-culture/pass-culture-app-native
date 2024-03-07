import React from 'react'
import styled from 'styled-components/native'

import { contactSupport } from 'features/auth/helpers/contactSupport'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'
import { Typo } from 'ui/theme'

export function PhoneValidationTooManyAttempts() {
  return (
    <GenericInfoPage
      title="Trop de tentatives&nbsp;!"
      icon={UserBlocked}
      buttons={[
        <ExternalTouchableLink
          as={ButtonTertiaryWhite}
          key={1}
          wording="Contacter le support"
          accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support"
          icon={EmailFilled}
          // @ts-expect-error: because of noUncheckedIndexedAccess
          externalNav={contactSupport.forPhoneNumberConfirmation}
        />,
        <InternalTouchableLink
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
