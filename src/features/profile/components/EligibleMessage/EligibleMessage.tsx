import React from 'react'

import { SubscriptionMessageV2 } from 'api/gen'
import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'
import { formatDateToLastUpdatedAtMessage } from 'features/profile/helpers/formatDateToLastUpdatedAtMessage'
import { getEligibilityEndDatetime } from 'features/profile/helpers/getEligibilityEndDatetime'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfile } from 'features/share/types'

type EligibleMessageProps = {
  eligibilityEndDatetime?: Exclude<UserProfile['eligibilityEndDatetime'], undefined>
  updatedAt?: Exclude<SubscriptionMessageV2['updatedAt'], undefined>
} & ProfileFeatureFlagsProps

export const EligibleMessage = ({
  eligibilityEndDatetime,
  updatedAt,
  featureFlags,
}: EligibleMessageProps) => {
  if (featureFlags.disableActivation) {
    return null
  }

  if (updatedAt) {
    return (
      <Subtitle
        startSubtitle="Dossier mis à jour le&nbsp;:"
        boldEndSubtitle={formatDateToLastUpdatedAtMessage(updatedAt)}
      />
    )
  }

  if (eligibilityEndDatetime) {
    return (
      <Subtitle
        startSubtitle="Tu es éligible jusqu’au"
        boldEndSubtitle={getEligibilityEndDatetime({ eligibilityEndDatetime })}
      />
    )
  }

  return null
}
