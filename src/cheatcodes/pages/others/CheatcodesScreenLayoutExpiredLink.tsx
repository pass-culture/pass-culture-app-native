import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { buildZendeskUrlForFraud } from 'features/profile/helpers/buildZendeskUrl'
import { useDeviceMetrics } from 'features/trustedDevice/helpers/useDeviceMetrics'
import { env } from 'libs/environment/env'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'
import { useVersion } from 'ui/hooks/useVersion'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

export const CheatcodesScreenLayoutExpiredLink = () => {
  const metrics = useDeviceMetrics()
  const { user } = useAuthContext()
  const version = useVersion()

  return (
    <LayoutExpiredLink
      customSubtitle="Custom subtitle layout expired link"
      urlFAQ={env.FAQ_LINK_RESET_PASSORD_EMAIL_NOT_RECEIVED}
      primaryButtonInformations={{
        wording: 'Contacter le service fraude',
        externalNav: { url: buildZendeskUrlForFraud({ user, metrics, version }) },
        icon: EmailFilled,
      }}
    />
  )
}
