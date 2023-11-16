import React from 'react'

import { formatToSlashedFrenchDate } from 'libs/dates'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'

export function YoungerBadge(props: { eligibilityStartDatetime: Readonly<Date> }) {
  const date = formatToSlashedFrenchDate(props.eligibilityStartDatetime.toISOString())
  const information = `Patience\u00a0! Reviens à partir du ${date} pour continuer ton inscription et bénéficier du crédit pass Culture.`
  return <InfoBanner icon={BicolorClock} message={information} testID="younger-badge" />
}
