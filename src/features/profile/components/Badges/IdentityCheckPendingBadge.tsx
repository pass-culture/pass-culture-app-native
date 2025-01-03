import React from 'react'

import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'

export const IdentityCheckPendingBadge = () => (
  <InfoBanner
    testID="identity-check-pending-badge"
    icon={BicolorClock}
    message="Ton inscription est en cours de traitement."
  />
)
