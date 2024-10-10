import React, { FC } from 'react'
import styled from 'styled-components/native'

import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { TypoDS } from 'ui/theme'

import { OpeningHours as OpeningHoursType, getOpeningHours } from './getOpeningHours'

type Props = { openingHours: OpeningHoursType }

export const OpeningHours: FC<Props> = ({ openingHours }) => {
  const { days } = getOpeningHours(openingHours)
  return (
    <StyledVerticalUl>
      {days.map((day) => (
        <StyledLi
          key={day.label}
          accessibilityLabel={`${day.label} ${day.hours.replace('/', ' puis ')}`}>
          <TypoDS.Body accessibilityHidden>{day.label}</TypoDS.Body>
          <TypoDS.Body accessibilityHidden>{day.hours}</TypoDS.Body>
        </StyledLi>
      ))}
    </StyledVerticalUl>
  )
}

const StyledVerticalUl = styled(VerticalUl)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
})

const StyledLi = styled(Li)({
  display: 'flex',
})
