import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { env } from 'libs/environment/env'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageDeprecated } from 'ui/pages/GenericInfoPageDeprecated'
import { Email } from 'ui/svg/icons/Email'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'

type Props = PropsWithChildren<{
  onBeforeNavigateContactFraudTeam: () => void
}>

export const GenericSuspendedAccount: React.FC<Props> = ({
  children,
  onBeforeNavigateContactFraudTeam,
}) => {
  const signOut = useLogoutRoutine()

  return (
    <GenericInfoPageDeprecated
      title="Ton compte a été suspendu"
      icon={UserBlocked}
      buttons={[
        <ExternalTouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording="Contacter le service fraude"
          onBeforeNavigate={onBeforeNavigateContactFraudTeam}
          accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le service fraude"
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
      <ChildrenContainer>{children}</ChildrenContainer>
    </GenericInfoPageDeprecated>
  )
}

const ChildrenContainer = styled.View({
  width: '100%',
})
