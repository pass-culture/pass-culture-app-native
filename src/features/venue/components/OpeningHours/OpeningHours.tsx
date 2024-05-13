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
        <DayWrapper key={day.label}>
          <DayLabel>{day.label}</DayLabel>
          <Hours>{day.hours}</Hours>
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

const DayLabel = styled.Text({
  fontSize: 15,
})
const Hours = styled.Text({
  fontSize: 15,
})
