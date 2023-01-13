import React from 'react'

import { Typo } from 'ui/theme/typography'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { monthNames } from './Calendar.utils'

type Props = {
  date: Date
}

export const MonthHeader: React.FC<Props> = ({ date }) => {
  const month = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
  return (
    <Typo.Body {...getHeadingAttrs(2)} accessibilityLiveRegion="polite">
      {month}
    </Typo.Body>
  )
}
