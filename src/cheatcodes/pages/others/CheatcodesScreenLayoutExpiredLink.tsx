import React from 'react'

import { env } from 'libs/environment/env'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

export const CheatcodesScreenLayoutExpiredLink = () => {
  return (
    <LayoutExpiredLink
      customSubtitle="Custom subtitle layout expired link"
      urlFAQ={env.FAQ_LINK_RESET_PASSORD_EMAIL_NOT_RECEIVED}
      primaryButtonInformations={{
        wording: 'Contacter le service fraude',
        externalNav: { url: `mailto:${env.FRAUD_EMAIL_ADDRESS}` },
        icon: EmailFilled,
      }}
    />
  )
}
