import { env } from 'process'

import React from 'react'
import styled from 'styled-components/native'

import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Email } from 'ui/svg/icons/Email'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'
import { Spacer, Typo } from 'ui/theme'

export const SuspensionConfirmation = () => {
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
          externalNav={{ url: `mailto:${env.SUPPORT_EMAIL_ADDRESS}` }}
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
      <StyledBody>En raison d’une activité suspicieuse, ton compte a été suspendu.</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>Si tu souhaites revoir cette décision, tu peux contacter le support.</StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
