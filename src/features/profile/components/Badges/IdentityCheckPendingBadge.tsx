import React from 'react'

import { InfoBanner } from 'ui/components/InfoBanner'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'

export const IdentityCheckPendingBadge = () => (
  <InfoBanner icon={BicolorClock} message="Ton inscription est en cours de traitement." />
)
