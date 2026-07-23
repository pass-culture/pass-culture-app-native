import React, { PropsWithChildren } from 'react'
import { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { buildZendeskUrlForFraud } from 'features/profile/helpers/buildZendeskUrl'
import { useDeviceMetrics } from 'features/trustedDevice/helpers/useDeviceMetrics'
import { genericInfoPageIllustrationUrls } from 'shared/illustrations/genericInfoPageIllustrations'
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
  const { isDesktopViewport } = useTheme()
  const signOut = useLogoutRoutine()
  const { user } = useAuthContext()
  const version = useVersion()
  const metrics = useDeviceMetrics()

  return (
    <GenericInfoPage
      illustration={UserBlocked}
      remoteIllustration={{
        url: genericInfoPageIllustrationUrls.blockedPaintingLarge,
        backgroundColor: 'information03',
        size: isDesktopViewport ? 'default' : 'small',
      }}
      title="Ton compte a été suspendu"
      buttonPrimary={{
        wording: 'Contacter le service fraude',
        onBeforeNavigate: onBeforeNavigateContactFraudTeam,
        externalNav: { url: buildZendeskUrlForFraud({ user, metrics, version }) },
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
