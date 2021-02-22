import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme/typography'

import { monthNames } from './Calendar.utils'

type Props = {
  date: Date
}
export const MonthHeader: React.FC<Props> = ({ date }) => {
  const month = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
  return (
    <StyledView>
      <Typo.Caption>{month}</Typo.Caption>
    </StyledView>
  )
}

const StyledView = styled.View({
  display: 'flex',
  alignItems: 'flex-start',
  width: '100%',
})
