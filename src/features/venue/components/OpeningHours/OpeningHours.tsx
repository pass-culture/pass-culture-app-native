import React, { FC } from 'react'
import styled from 'styled-components/native'

import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { Typo } from 'ui/theme'

import { OpeningHours as OpeningHoursType, getOpeningHours } from './getOpeningHours'

type Props = { openingHours: OpeningHoursType }

export const OpeningHours: FC<Props> = ({ openingHours }) => {
  const { days } = getOpeningHours(openingHours)
  if (!days) return null
  return (
    <StyledVerticalUl>
      {days.map((day) => (
        <StyledLi
          key={day.label}
          accessibilityLabel={`${day.label} ${day.hours.replace('/', ' puis ')}`}>
          <Typo.Body accessibilityHidden>{day.label}</Typo.Body>
          <Typo.Body accessibilityHidden>{day.hours}</Typo.Body>
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
