import React, { FC } from 'react'
import styled from 'styled-components/native'

import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import {
  getOpeningHoursStatus,
  OpeningHours,
  OpeningHoursStatusViewmodelState,
} from './getOpeningHoursStatus'

type Props = {
  openingHours: OpeningHours
  currentDate: Date
}

export const OpeningHoursStatus: FC<Props> = ({ openingHours, currentDate }) => {
  const status = getOpeningHoursStatus({
    openingHours,
    currentDate,
  })
  const color = colors[status.state]
  return (
    <Container>
      <ClockFilled color={color as ColorsEnum} size={16} />
      <Typo.Caption style={{ color }}>{status.text}</Typo.Caption>
    </Container>
  )
}

const colors: Record<OpeningHoursStatusViewmodelState, ColorsEnum | string> = {
  open: ColorsEnum.GREEN_VALID,
  close: ColorsEnum.ERROR,
  'close-soon': '#D77419',
  'open-soon': '#D77419',
}

const Container = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
})
