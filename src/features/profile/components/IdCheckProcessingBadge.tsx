import { t } from '@lingui/macro'
import React from 'react'

import { ProfileBadge } from 'features/profile/components/ProfileBadge'
import { Clock } from 'ui/svg/icons/Clock'

export function IdCheckProcessingBadge() {
  return (
    <ProfileBadge
      icon={Clock}
      message={t`Dossier déposé ! Nous avons bien reçu ton dossier et sommes en train de l'analyser.`}
    />
  )
}
