import React, { FC, useEffect, useState } from 'react'
import styled, { DefaultTheme } from 'styled-components/native'

import { OpeningHours, OpeningHoursStatusState } from 'features/venue/types'
import { useAppStateChange } from 'libs/appState'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { getSpacing, Typo } from 'ui/theme'

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

  if (!text || state === 'not-applicable') return null

  return (
    <Container>
      <StyledClock state={state} />
      <StyledText state={state}>{text}</StyledText>
    </Container>
  )
}

const getIconColorFromState = (theme: DefaultTheme) => (state: OpeningHoursStatusState) => {
  return {
    open: theme.designSystem.color.icon.success,
    close: theme.designSystem.color.icon.error,
    'open-soon': theme.designSystem.color.icon.warning,
    'close-soon': theme.designSystem.color.icon.warning,
    'not-applicable': theme.designSystem.color.icon.default,
  }[state]
}

const StyledClock = styled(ClockFilled).attrs<{ state: OpeningHoursStatusState }>(
  ({ theme, state }) => ({
    color: getIconColorFromState(theme)(state),
    size: theme.icons.sizes.extraSmall,
  })
)<{ state: OpeningHoursStatusState }>``

const getTextColorFromState = (theme: DefaultTheme) => (state: OpeningHoursStatusState) => {
  return {
    open: theme.designSystem.color.text.success,
    close: theme.designSystem.color.text.error,
    'open-soon': theme.designSystem.color.text.warning,
    'close-soon': theme.designSystem.color.text.warning,
    'not-applicable': theme.designSystem.color.text.default,
  }[state]
}

const StyledText = styled(Typo.BodyAccentXs)<{ state: OpeningHoursStatusState }>(
  ({ state, theme }) => ({
    color: getTextColorFromState(theme)(state),
  })
)

const Container = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: getSpacing(1),
})
