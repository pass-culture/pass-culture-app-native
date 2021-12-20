import { t } from '@lingui/macro'
import React from 'react'

import { ProfileBadge } from 'features/profile/components/ProfileBadge'
import { Clock } from 'ui/svg/icons/Clock'

export const IdentityCheckPendingBadge = () => (
  <ProfileBadge
    popOverIcon={Clock}
    message={t`Ton inscription est en cours de traitement.`}
    testID={'identity-check-pending-badge'}
  />
)
