import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { contactSupport } from 'features/auth/support.services'
import { navigateToHome } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { AccountLocked } from 'ui/svg/icons/AccountLocked'
import { Email } from 'ui/svg/icons/Email'
import { ColorsEnum, Typo } from 'ui/theme'

export function PhoneValidationTooManyAttempts() {
  return (
    <GenericInfoPage
      title={t`Trop de tentatives\u00a0!`}
      icon={AccountLocked}
      buttons={[
        <ButtonTertiaryWhite
          key={1}
          wording={t`Contacter le support`}
          icon={Email}
          onPress={contactSupport.forPhoneNumberConfirmation}
        />,
        <ButtonPrimaryWhite key={2} wording={t`Retourner à l'accueil`} onPress={navigateToHome} />,
      ]}>
      <StyledBody>
        {t`Tu as dépassé le nombre d’essais autorisés. L’accès à ton crédit pass Culture a été bloqué. Pour le récupérer tu peux\u00a0:`}
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
