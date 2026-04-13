import React from 'react'

import { ActivationBanner } from 'features/profile/components/Banners/ActivationBanner/ActivationBanner'
import { YoungerBanner } from 'features/profile/components/Banners/GeneralPublicBanner/YoungerBanner'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfile } from 'features/share/types'

export const GeneralPublicBanner = ({
  user,
  featureFlags,
}: { user: UserProfile } & ProfileFeatureFlagsProps) => {
  if (!user) return null

  const { eligibilityStartDatetime, subscriptionMessage } = user

  const formattedEligibilityStartDatetime = eligibilityStartDatetime
    ? new Date(eligibilityStartDatetime)
    : undefined

  const today = new Date()
  const isUserTooYoungToBeEligible =
    formattedEligibilityStartDatetime && formattedEligibilityStartDatetime > today

  if (isUserTooYoungToBeEligible) {
    return <YoungerBanner eligibilityStartDatetime={formattedEligibilityStartDatetime} />
  }

  if (subscriptionMessage) {
    return <ActivationBanner featureFlags={featureFlags} />
  }

  return null
}
