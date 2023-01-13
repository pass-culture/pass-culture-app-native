import React from 'react'
import styled from 'styled-components/native'

import { useLogoutRoutine } from 'features/auth/logout/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Email } from 'ui/svg/icons/Email'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'
import { Spacer, Typo } from 'ui/theme'

export const FraudulentAccount = () => {
  const signOut = useLogoutRoutine()

  return (
    <GenericInfoPage
      title="Ton compte a été suspendu"
      icon={UserBlocked}
      buttons={[
        <ExternalTouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording="Contacter le service"
          accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support"
          externalNav={{ url: `mailto:${env.FRAUD_EMAIL_ADDRESS}` }}
          icon={Email}
        />,
        <InternalTouchableLink
          key={2}
          as={ButtonTertiaryWhite}
          wording="Retourner à l’accueil"
          navigateTo={{ ...navigateToHomeConfig, params: { ...navigateToHomeConfig.params } }}
          onBeforeNavigate={signOut}
          icon={PlainArrowPrevious}
        />,
      ]}>
      <StyledBody>Ton compte est actuellement suspendu pour des raisons de sécurité.</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>
        Pour en savoir plus, tu peux contacter l’équipe de lutte contre la fraude.
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
