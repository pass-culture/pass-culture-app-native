import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { buildZendeskUrlForFraud } from 'features/profile/helpers/buildZendeskUrl'
import { useDeviceMetrics } from 'features/trustedDevice/helpers/useDeviceMetrics'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'
import { useVersion } from 'ui/hooks/useVersion'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

export const SuspensionChoiceExpiredLink = () => {
  const { user } = useAuthContext()
  const version = useVersion()
  const metrics = useDeviceMetrics()
  return (
    <LayoutExpiredLink
      customSubtitle={`Le lien que tu reçois par e-mail expire 7 jours après sa réception.${DOUBLE_LINE_BREAK}Tu peux toujours contacter le service fraude pour sécuriser ton compte.`}
      primaryButtonInformations={{
        wording: 'Contacter le service fraude',
        externalNav: { url: buildZendeskUrlForFraud({ user, metrics, version }) },
        icon: EmailFilled,
      }}
    />
  )
}
