import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'

import { ProfileBadge } from 'features/profile/components/ProfileBadge'
import { IconInterface } from 'ui/svg/icons/types'

type IdCheckProcessingBadgeProps = {
  icon?: FunctionComponent<IconInterface>
  message?: string
}

export function IdCheckProcessingBadge(props: IdCheckProcessingBadgeProps) {
  return (
    <ProfileBadge
      icon={props.icon}
      message={
        props.message ||
        t`Dossier déposé, nous avons bien reçu ton dossier et sommes en train de l’analyser !`
      }
    />
  )
}
