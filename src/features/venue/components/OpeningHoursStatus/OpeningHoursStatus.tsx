import React, { FC } from 'react'
import styled, { DefaultTheme } from 'styled-components/native'

import { OpeningHours } from 'features/venue/types'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { getSpacing, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports

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
  return (
    <Container>
      <StyledClock state={state} />
      <StyledText state={state}>{text}</StyledText>
    </Container>
  )
}

const getColorFromState = (theme: DefaultTheme) => (state: OpeningHoursStatusState) => {
  return {
    open: theme.colors.greenValid,
    close: theme.colors.error,
    'open-soon': theme.colors.orange,
    'close-soon': theme.colors.orange,
  }[state]
}

const StyledClock = styled(ClockFilled).attrs<{ state: OpeningHoursStatusState }>(
  ({ theme, state }) => {
    return { color: getColorFromState(theme)(state), size: 16 }
  }
)<{ state: OpeningHoursStatusState }>``

const StyledText = styled(Typo.Caption)<{ state: OpeningHoursStatusState }>(({ state, theme }) => ({
  color: getColorFromState(theme)(state),
}))

const Container = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: getSpacing(1),
})
