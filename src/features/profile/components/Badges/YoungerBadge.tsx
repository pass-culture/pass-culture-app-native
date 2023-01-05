import React from 'react'

import { formatToSlashedFrenchDate } from 'libs/dates'
import { Banner } from 'ui/components/Banner'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'

export function YoungerBadge(props: { eligibilityStartDatetime: Date }) {
  const date = formatToSlashedFrenchDate(props.eligibilityStartDatetime.toISOString())
  const information = `Patience\u00a0! Reviens à partir du ${date} pour continuer ton inscription et bénéficier du crédit pass Culture.`
  return <Banner icon={BicolorClock} message={information} testID="younger-badge" />
}
