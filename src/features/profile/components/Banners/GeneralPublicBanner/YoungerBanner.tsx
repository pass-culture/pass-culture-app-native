import React from 'react'

import { formatToSlashedFrenchDate } from 'libs/dates'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'

type Props = { eligibilityStartDatetime: Date }

export const YoungerBanner = ({ eligibilityStartDatetime }: Props) => {
  if (!eligibilityStartDatetime) return null
  const date = formatToSlashedFrenchDate(new Date(eligibilityStartDatetime).toISOString())
  const information = `Patience\u00a0! Reviens à partir du ${date} pour continuer ton inscription et bénéficier du crédit pass Culture.`

  return <Banner Icon={ClockFilled} label={information} testID="younger-banner" />
}
