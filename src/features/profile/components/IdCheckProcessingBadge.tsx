import { t } from '@lingui/macro'
import React from 'react'

import { ProfileBadge } from 'features/profile/components/ProfileBadge'
import { Clock } from 'ui/svg/icons/Clock'

export function IdCheckProcessingBadge() {
  return (
    <ProfileBadge
      icon={Clock}
      message={t`Un peu de patience. En raison du grand nombre de demandes ton dossier doit être analysé manuellement par nos équipes.`}
    />
  )
}
