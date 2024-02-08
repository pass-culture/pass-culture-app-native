import React from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import { Timestamp } from 'react-native-reanimated/lib/types/lib/reanimated2/commonTypes'
import styled from 'styled-components/native'

import { DAYS, SHORT_DAYS } from 'shared/date/days'
import { Month, MONTHS, SHORT_MONTHS } from 'shared/date/months'
import { getSpacing, Typo } from 'ui/theme'

type DayMapping = {
  weekday: string
  fullWeekDay: string
  dayDate: number
  month: string
  fullMonth: Month
  timestamp: Timestamp
}

const extractDate = (date: Date): DayMapping => {
  const dayIndex = date.getDay()
  const monthIndex = date.getMonth()
  const dayDate = date.getDate()
  const timestamp = date.getTime()
  const extractedDate = {
    weekday: SHORT_DAYS[dayIndex],
    fullWeekDay: DAYS[dayIndex],
    dayDate,
    month: SHORT_MONTHS[monthIndex],
    fullMonth: MONTHS[monthIndex],
    timestamp,
  }
  return extractedDate
}

type Props = {
  dates: Date[]
  selectedDate: Date
  onTabChange: (date: Date) => void
}

export const MovieCalendar: React.FC<Props> = ({ dates, selectedDate, onTabChange }) => {
  return (
    <Container>
      <BottomBar />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={scrollViewContainer}>
        {dates.map((date) => {
          const { weekday, fullWeekDay, dayDate, month, fullMonth, timestamp } = extractDate(date)
          const isSelected = selectedDate.getTime() === timestamp

          const { CalendarText } = StatusPattern[isSelected ? 'selected' : 'default']
          return (
            <CalendarCell onPress={() => onTabChange(date)} key={`${timestamp} - ${isSelected}`}>
              <CalendarTextView>
                <CalendarText numberOfLines={1} accessibilityLabel={fullWeekDay}>
                  {weekday}
                </CalendarText>
                <CalendarText numberOfLines={1}>{dayDate}</CalendarText>
                <CalendarText numberOfLines={1} accessibilityLabel={fullMonth}>
                  {month}
                </CalendarText>
              </CalendarTextView>
              {isSelected ? <SelectedBottomBar /> : null}
            </CalendarCell>
          )
        })}
      </ScrollView>
    </Container>
  )
}

const Container = styled.View({})

const scrollViewContainer = { marginLeft: getSpacing(6), marginRight: getSpacing(6) }

const BottomBar = styled.View(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  height: getSpacing(1),
  width: '100%',
  backgroundColor: theme.colors.greyLight,
}))

const SelectedBottomBar = styled(BottomBar)(({ theme }) => ({
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

const DefaultCalendarText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.greyDark,
  textAlign: 'center',
  width: getSpacing(10),
}))

const SelectedCalendarText = styled(DefaultCalendarText)(({ theme }) => ({
  color: theme.colors.primary,
}))

const StatusPattern = {
  default: {
    CalendarText: DefaultCalendarText,
  },
  selected: {
    CalendarText: SelectedCalendarText,
  },
}
