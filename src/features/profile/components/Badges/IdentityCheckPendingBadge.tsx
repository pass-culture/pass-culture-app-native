import React from 'react'

import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { Clock } from 'ui/svg/icons/Clock'

export const IdentityCheckPendingBadge = () => (
  <InfoBanner
    testID="identity-check-pending-badge"
    icon={Clock}
    message="Ton inscription est en cours de traitement."
  />
)
