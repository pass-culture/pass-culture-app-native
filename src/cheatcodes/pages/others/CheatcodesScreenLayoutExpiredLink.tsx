import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { buildZendeskUrlForFraud } from 'features/profile/helpers/buildZendeskUrl'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { env } from 'libs/environment/env'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'
import { useVersion } from 'ui/hooks/useVersion'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

export const CheatcodesScreenLayoutExpiredLink = () => {
  const { user } = useAuthContext()
  const deviceInfo = useDeviceInfo()
  const version = useVersion()

  return (
    <LayoutExpiredLink
      customSubtitle="Custom subtitle layout expired link"
      urlFAQ={env.FAQ_LINK_RESET_PASSORD_EMAIL_NOT_RECEIVED}
      primaryButtonInformations={{
        wording: 'Contacter le service fraude',
        externalNav: { url: buildZendeskUrlForFraud({ user, deviceInfo, version }) },
        icon: EmailFilled,
      }}
    />
  )
}
