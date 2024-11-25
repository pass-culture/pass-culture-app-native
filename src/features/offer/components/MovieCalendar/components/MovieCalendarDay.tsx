import React, { useMemo } from 'react'
import { View, ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { MovieCalendarBottomBar } from 'features/offer/components/MovieCalendar/components/MovieCalendarBottomBar'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing, TypoDS } from 'ui/theme'

import { useMovieCalendarDay } from '../hooks/useMovieCalendarDay'

type Props = {
  date: Date
  onTabChange: (date: Date) => void
  selectedDate?: Date
  onLayout?: ViewProps['onLayout']
  disabled?: boolean
}

export const MovieCalendarDay: React.FC<Props> = ({
  date,
  selectedDate,
  onTabChange,
  onLayout,
  disabled,
}) => {
  const { weekDay, dayDate, month, accessibilityLabel, isSelected } = useMovieCalendarDay(
    date,
    selectedDate
  )

  const CalendarText = useMemo(() => {
    if (disabled) {
      return DisabledCalendarText
    }
    if (selectedDate) {
      return SelectedCalendarText
    }
    return DefaultCalendarText
  }, [disabled, selectedDate])

  return (
    <CalendarCell
      disabled={disabled}
      onLayout={onLayout}
      testID="movie-calendar-day"
      onPress={() => onTabChange(date)}>
      <CalendarTextView accessibilityLabel={accessibilityLabel}>
        <CalendarText numberOfLines={1}>{weekDay}</CalendarText>
        <CalendarText numberOfLines={1}>{dayDate}</CalendarText>
        <CalendarText numberOfLines={1}>{month}</CalendarText>
      </CalendarTextView>
      {isSelected ? <SelectedBottomBar /> : null}
    </CalendarCell>
  )
}

const SelectedBottomBar = styled(MovieCalendarBottomBar)(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  borderRadius: getSpacing(1),
}))

const CalendarTextView = styled(View)({
  marginHorizontal: getSpacing(4),
  marginBottom: getSpacing(2),
})

const CalendarCell = styled(TouchableOpacity)({
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
})

const DefaultCalendarText = styled(TypoDS.BodyAccent)(({ theme }) => ({
  color: theme.colors.greyDark,
  textAlign: 'center',
  width: getSpacing(theme.isDesktopViewport ? 22 : 10),
}))

const SelectedCalendarText = styled(DefaultCalendarText)(({ theme }) => ({
  color: theme.colors.primary,
}))

const DisabledCalendarText = styled(DefaultCalendarText)(({ theme }) => ({
  color: theme.colors.greyMedium,
}))
