import React from 'react'

import { ProfileBadge } from 'features/profile/components/Badges/ProfileBadge'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { Clock } from 'ui/svg/icons/Clock'

export function YoungerBadge(props: { eligibilityStartDatetime: Date }) {
  const date = formatToSlashedFrenchDate(props.eligibilityStartDatetime.toISOString())
  const information = `Patience\u00a0! Reviens à partir du ${date} pour continuer ton inscription et bénéficier du crédit pass Culture.`
  return <ProfileBadge popOverIcon={Clock} message={information} testID={'younger-badge'} />
}
