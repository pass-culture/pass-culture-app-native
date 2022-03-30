import React from 'react'

import { getHeadingAttrs, Typo } from 'ui/theme/typography'

import { monthNames } from './Calendar.utils'

type Props = {
  date: Date
}

export const MonthHeader: React.FC<Props> = ({ date }) => {
  const month = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
  return <Typo.Body {...getHeadingAttrs(3)}>{month}</Typo.Body>
}
