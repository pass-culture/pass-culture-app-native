import React from 'react'

import { env } from 'libs/environment'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

export const SuspensionChoiceExpiredLink = () => (
  <LayoutExpiredLink
    customBodyText={`Le lien que tu reçois par e-mail expire 7 jours après sa réception.${DOUBLE_LINE_BREAK}Tu peux toujours contacter le service fraude pour sécuriser ton compte.`}
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
