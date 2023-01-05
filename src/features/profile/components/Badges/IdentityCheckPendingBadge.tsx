import React from 'react'

import { Banner } from 'ui/components/Banner'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'

export const IdentityCheckPendingBadge = () => (
  <Banner icon={BicolorClock} message="Ton inscription est en cours de traitement." />
)
