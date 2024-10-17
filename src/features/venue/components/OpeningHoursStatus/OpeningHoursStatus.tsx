import React, { FC, useEffect, useState } from 'react'
import styled, { DefaultTheme } from 'styled-components/native'

import { OpeningHours, OpeningHoursStatusState } from 'features/venue/types'
import { useAppStateChange } from 'libs/appState'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { getSpacing, TypoDS } from 'ui/theme'

import {
  getOpeningHoursStatus,
  ONE_HOUR_IN_MILLISECONDS,
  THIRTY_MINUTES_IN_MILLISECONDS,
} from './getOpeningHoursStatus'

type Props = {
  openingHours: OpeningHours
  timezone: string
  currentDate: Date
}

export const OpeningHoursStatus: FC<Props> = ({ openingHours, currentDate, timezone }) => {
  const [date, setDate] = useState(currentDate)
  const {
    openingState: state,
    openingLabel: text,
    nextChangeTime: nextChange,
  } = getOpeningHoursStatus({
    openingHours,
    currentDate: date,
    timezone,
  })

  useEffect(() => {
    if (!nextChange) return

    let timeoutId: NodeJS.Timeout
    let timeUntilNextStateChange = nextChange.getTime() - date.getTime()
    if (timeUntilNextStateChange > ONE_HOUR_IN_MILLISECONDS) {
      timeUntilNextStateChange -= ONE_HOUR_IN_MILLISECONDS
    }
    if (timeUntilNextStateChange <= THIRTY_MINUTES_IN_MILLISECONDS) {
      timeoutId = setTimeout(() => setDate(new Date()), timeUntilNextStateChange)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useAppStateChange(() => setDate(new Date()), undefined)

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

const StyledText = styled(TypoDS.BodyAccentXs)<{ state: OpeningHoursStatusState }>(
  ({ state, theme }) => ({
    color: getColorFromState(theme)(state),
  })
)

const Container = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: getSpacing(1),
})
