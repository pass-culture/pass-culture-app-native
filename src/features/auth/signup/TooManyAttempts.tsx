import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { contactSupport } from 'features/auth/support.services'
import { navigateToHome } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { Confidentiality } from 'ui/svg/icons/Confidentiality'
import { Email } from 'ui/svg/icons/Email'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export function TooManyAttempts() {
  return (
    <GenericInfoPage
      title={t`Trop de tentatives !`}
      icon={Confidentiality}
      iconSize={getSpacing(45)}>
      <StyledBody>
        {t`Tu as dépassé le nombre d’essais autorisés. L’accès à ton crédit pass Culture a été bloqué. Pour le récupérer tu peux :`}
      </StyledBody>
      <Spacer.Column numberOfSpaces={7} />
      <ButtonTertiaryWhite
        title={t`Contacter le support`}
        icon={Email}
        onPress={contactSupport.forPhoneNumberConfirmation}
        inline
      />
      <Spacer.Column numberOfSpaces={17} />
      <ButtonPrimaryWhite title={t`Retourner à l'accueil`} onPress={navigateToHome} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
