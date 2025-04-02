import React from 'react'

import { env } from 'libs/environment/env'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

export const CheatcodesScreenLayoutExpiredLink = () => {
  return (
    <LayoutExpiredLink
      urlFAQ={env.FAQ_LINK_RESET_PASSORD_EMAIL_NOT_RECEIVED}
      renderCustomButton={() => (
        <ExternalTouchableLink
          as={ButtonPrimaryWhite}
          wording="Contacter le service fraude"
          accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le service fraude"
          externalNav={{ url: `mailto:${env.FRAUD_EMAIL_ADDRESS}` }}
          icon={EmailFilled}
        />
      )}
    />
  )
}
