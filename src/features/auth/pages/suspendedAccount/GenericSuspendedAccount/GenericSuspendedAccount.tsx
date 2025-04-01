import React, { PropsWithChildren } from 'react'

import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { env } from 'libs/environment/env'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
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
    <GenericInfoPage
      illustration={UserBlocked}
      title="Ton compte a été suspendu"
      buttonPrimary={{
        wording: 'Contacter le service fraude',
        onBeforeNavigate: onBeforeNavigateContactFraudTeam,
        externalNav: { url: `mailto:${env.FRAUD_EMAIL_ADDRESS}` },
      }}
      buttonTertiary={{
        wording: 'Retourner à l’accueil',
        onBeforeNavigate: signOut,
        navigateTo: { ...navigateToHomeConfig, params: { ...navigateToHomeConfig.params } },
        icon: PlainArrowPrevious,
      }}>
      {children}
    </GenericInfoPage>
  )
}
