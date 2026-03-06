import React from 'react'

import { YoungerBanner } from 'features/profile/components/Banners/GeneralPublicBanner/YoungerBanner'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

export const GeneralPublicBanner = ({ user }: { user: UserProfileResponseWithoutSurvey }) => {
  const { eligibilityStartDatetime } = user

  const formattedEligibilityStartDatetime = eligibilityStartDatetime
    ? new Date(eligibilityStartDatetime)
    : undefined

  const today = new Date()
  const isUserTooYoungToBeEligible =
    formattedEligibilityStartDatetime && formattedEligibilityStartDatetime > today

  if (isUserTooYoungToBeEligible) {
    return <YoungerBanner eligibilityStartDatetime={formattedEligibilityStartDatetime} />
  }

  return null
}
