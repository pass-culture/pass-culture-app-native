import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { buildZendeskUrlForFraud } from 'features/profile/pages/DebugScreen/buildZendeskUrl'
import { env } from 'libs/environment/env'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

export const CheatcodesScreenLayoutExpiredLink = () => {
  const { user } = useAuthContext()

  return (
    <LayoutExpiredLink
      customSubtitle="Custom subtitle layout expired link"
      urlFAQ={env.FAQ_LINK_RESET_PASSORD_EMAIL_NOT_RECEIVED}
      primaryButtonInformations={{
        wording: 'Contacter le service fraude',
        externalNav: { url: buildZendeskUrlForFraud(user) },
        icon: EmailFilled,
      }}
    />
  )
}
