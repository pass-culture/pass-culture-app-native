import React from 'react'

import { SubscriptionMessageV2 } from 'api/gen'
import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'
import { formatDateToLastUpdatedAtMessage } from 'features/profile/helpers/formatDateToLastUpdatedAtMessage'
import { getEligibilityEndDatetime } from 'features/profile/helpers/getEligibilityEndDatetime'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

type EligibleMessageProps = {
  eligibilityEndDatetime?: UserProfileResponseWithoutSurvey['eligibilityEndDatetime']
  updatedAt?: SubscriptionMessageV2['updatedAt']
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
