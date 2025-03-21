import React from 'react'

import { CAPITALIZED_MONTHS } from 'shared/date/months'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  date: Date
}

export const MonthHeader: React.FC<Props> = ({ date }) => {
  const month = `${CAPITALIZED_MONTHS[date.getMonth()]} ${date.getFullYear()}`
  return (
    <Typo.Body {...getHeadingAttrs(2)} accessibilityLiveRegion="polite">
      {month}
    </Typo.Body>
  )
}
