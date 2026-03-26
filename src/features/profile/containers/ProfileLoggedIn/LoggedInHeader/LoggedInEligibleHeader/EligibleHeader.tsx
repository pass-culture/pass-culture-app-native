import React from 'react'

import { SubscriptionStepperResponseV2 } from 'api/gen'
import { ActivationBanner } from 'features/profile/components/Banners/ActivationBanner/ActivationBanner'
import { EligibleMessage } from 'features/profile/components/EligibleMessage/EligibleMessage'
import { getProfileHeaderTitle } from 'features/profile/helpers/getProfileHeaderTitle'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type Props = {
  user: UserProfileResponseWithoutSurvey
  subscriptionInfos?: SubscriptionStepperResponseV2
} & ProfileFeatureFlagsProps

export const EligibleHeader = ({ featureFlags, user, subscriptionInfos }: Props) => {
  const { firstName, lastName, eligibilityEndDatetime } = user
  const headerTitle = getProfileHeaderTitle({ firstName, lastName })

  return (
    <ViewGap gap={6} testID="eligible-header">
      <ViewGap gap={2}>
        <PageHeader title={headerTitle} featureFlags={featureFlags} numberOfLines={3} />
        <EligibleMessage
          eligibilityEndDatetime={eligibilityEndDatetime}
          updatedAt={subscriptionInfos?.subscriptionMessage?.updatedAt}
          featureFlags={featureFlags}
        />
      </ViewGap>
      <ActivationBanner featureFlags={featureFlags} />
    </ViewGap>
  )
}
