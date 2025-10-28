import React from 'react'

import { Banner } from 'ui/designSystem/Banner/Banner'
import { Clock } from 'ui/svg/icons/Clock'

export const IdentityCheckPendingBadge = () => (
  <Banner
    testID="identity-check-pending-badge"
    Icon={Clock}
    label="Ton inscription est en cours de traitement."
  />
)
