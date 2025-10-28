import React from 'react'

import { formatToSlashedFrenchDate } from 'libs/dates'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Clock } from 'ui/svg/icons/Clock'

export function YoungerBadge(props: { eligibilityStartDatetime: Date }) {
  const date = formatToSlashedFrenchDate(props.eligibilityStartDatetime.toISOString())
  const information = `Patience\u00a0! Reviens à partir du ${date} pour continuer ton inscription et bénéficier du crédit pass Culture.`
  return <Banner Icon={Clock} label={information} testID="younger-badge" />
}
