import React, { PropsWithChildren } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { buildZendeskUrlForFraud } from 'features/profile/helpers/buildZendeskUrl'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { useVersion } from 'ui/hooks/useVersion'
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
  const { user } = useAuthContext()
  const deviceInfo = useDeviceInfo()
  const version = useVersion()

  return (
    <GenericInfoPage
      illustration={UserBlocked}
      title="Ton compte a été suspendu"
      buttonPrimary={{
        wording: 'Contacter le service fraude',
        onBeforeNavigate: onBeforeNavigateContactFraudTeam,
        externalNav: { url: buildZendeskUrlForFraud({ user, deviceInfo, version }) },
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
