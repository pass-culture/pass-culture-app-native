import React from 'react'

import { ProfileBadge } from 'features/profile/components/Badges/ProfileBadge'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'

export const IdentityCheckPendingBadge = () => (
  <ProfileBadge
    popOverIcon={BicolorClock}
    message="Ton inscription est en cours de traitement."
    testID="identity-check-pending-badge"
  />
)
