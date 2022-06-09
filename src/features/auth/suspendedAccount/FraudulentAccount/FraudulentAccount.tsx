import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { contactSupport } from 'features/auth/support.services'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Email } from 'ui/svg/icons/Email'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'
import { Spacer, Typo } from 'ui/theme'

export const FraudulentAccount = () => {
  return (
    <GenericInfoPage
      title={t`Ton compte a été suspendu`}
      icon={UserBlocked}
      buttons={[
        <TouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording={t`Contacter le support`}
          accessibilityLabel={t`Ouvrir le gestionnaire mail pour contacter le support`}
          externalNav={contactSupport.forGenericQuestion}
          icon={Email}
        />,
        <TouchableLink
          key={2}
          as={ButtonTertiaryWhite}
          wording={t`Retourner à l'accueil`}
          navigateTo={navigateToHomeConfig}
          icon={PlainArrowPrevious}
        />,
      ]}>
      <StyledBody>{t`En raison d’une activité suspiscieuse, notre équipe anti fraude a suspendu ton compte.`}</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>
        {t`Si tu souhaites revoir cette décision, tu peux contacter le support.`}
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
