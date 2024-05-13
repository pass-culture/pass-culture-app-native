import React, { FC } from 'react'
import styled from 'styled-components/native'

import { OpeningHours } from 'features/venue/types'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { getSpacing, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { getOpeningHoursStatus, OpeningHoursStatusState } from './getOpeningHoursStatus'

type Props = {
  openingHours: OpeningHours
  currentDate: Date
}

export const OpeningHoursStatus: FC<Props> = ({ openingHours, currentDate }) => {
  const { state, text } = getOpeningHoursStatus({
    openingHours,
    currentDate,
  })
  const color = colors[state]
  return (
    <Container>
      <ClockFilled color={color as ColorsEnum} size={16} />
      <Typo.Caption style={{ color }}>{text}</Typo.Caption>
    </Container>
  )
}

const colors: Record<OpeningHoursStatusState, ColorsEnum | string> = {
  open: ColorsEnum.GREEN_VALID,
  close: ColorsEnum.ERROR,
  'close-soon': '#D77419',
  'open-soon': '#D77419',
}

const Container = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: getSpacing(1),
})
