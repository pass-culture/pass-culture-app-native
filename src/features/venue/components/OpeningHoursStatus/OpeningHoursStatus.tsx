import React, { FC, useEffect, useState } from 'react'
import styled, { DefaultTheme } from 'styled-components/native'

import { OpeningHours, OpeningHoursStatusState } from 'features/venue/types'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { getSpacing, Typo } from 'ui/theme'

import { getOpeningHoursStatus } from './getOpeningHoursStatus'

type Props = {
  openingHours: OpeningHours
  currentDate: Date
}

const THIRTHY_MINUTES_IN_MILLISECONDS = 30 * 60 * 1000

export const OpeningHoursStatus: FC<Props> = ({ openingHours, currentDate }) => {
  const [date, setDate] = useState(currentDate)
  const { state, text, nextChange } = getOpeningHoursStatus({
    openingHours,
    currentDate: date,
  })

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (nextChange) {
      const timeUntilNextStateChange = nextChange.getTime() - date.getTime()
      if (timeUntilNextStateChange <= THIRTHY_MINUTES_IN_MILLISECONDS) {
        timeoutId = setTimeout(() => setDate(new Date()), timeUntilNextStateChange)
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    'open-soon': theme.colors.goldDark,
    'close-soon': theme.colors.goldDark,
  }[state]
}

const StyledClock = styled(ClockFilled).attrs<{ state: OpeningHoursStatusState }>(
  ({ theme, state }) => ({
    color: getColorFromState(theme)(state),
    size: theme.icons.sizes.extraSmall,
  })
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
