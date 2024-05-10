import React, { FC } from 'react'
import styled from 'styled-components/native'

import {
  OpeningHours as OpeningHoursType,
  useOpeningHoursViewModel,
} from './OpeningHours.viewmodel'

type Props = { openingHours: OpeningHoursType }

export const OpeningHours: FC<Props> = ({ openingHours }) => {
  const { days } = useOpeningHoursViewModel(openingHours)
  return (
    <Container>
      {days.map((day) => (
        <Day key={day.label} day={day.label} hours={day.hours} />
      ))}
    </Container>
  )
}

const Container = styled.View({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
})

const Day: FC<{ day: string; hours: string }> = ({ day, hours }) => {
  return (
    <DayWrapper>
      <DayLabel>{day}</DayLabel>
      <Hours>{hours}</Hours>
    </DayWrapper>
  )
}

const DayWrapper = styled.View({
  gap: 4,
})

const DayLabel = styled.Text({
  fontSize: 15,
})
const Hours = styled.Text({
  fontSize: 15,
})
