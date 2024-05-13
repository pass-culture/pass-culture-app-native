import React, { FC } from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

import { OpeningHours as OpeningHoursType, getOpeningHours } from './getOpeningHours'

type Props = { openingHours: OpeningHoursType }

export const OpeningHours: FC<Props> = ({ openingHours }) => {
  const { days } = getOpeningHours(openingHours)
  return (
    <Container>
      {days.map((day) => (
        <DayWrapper key={day.label}>
          <Typo.Body>{day.label}</Typo.Body>
          <Typo.Body>{day.hours}</Typo.Body>
        </DayWrapper>
      ))}
    </Container>
  )
}

const Container = styled.View({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
})

const DayWrapper = styled.View({
  gap: 4,
})
