import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { contactSupport } from 'features/auth/support.services'
import { navigateToHome } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { Email } from 'ui/svg/icons/Email'
import { UserBlockedDeprecated } from 'ui/svg/icons/UserBlocked_deprecated'
import { Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
export function PhoneValidationTooManyAttempts() {
  return (
    <GenericInfoPage
      title={t`Trop de tentatives\u00a0!`}
      icon={UserBlockedDeprecated}
      buttons={[
        <ButtonTertiaryWhite
          key={1}
          title={t`Contacter le support`}
          icon={Email}
          onPress={contactSupport.forPhoneNumberConfirmation}
        />,
        <ButtonPrimaryWhite key={2} title={t`Retourner à l'accueil`} onPress={navigateToHome} />,
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
