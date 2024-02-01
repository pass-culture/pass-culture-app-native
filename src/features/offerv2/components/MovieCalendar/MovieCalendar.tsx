import React from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import { Timestamp } from 'react-native-reanimated/lib/types/lib/reanimated2/commonTypes'
import styled from 'styled-components/native'

import { SHORT_MONTHS, DAYS, MONTHS, SHORT_DAYS } from 'libs/parsers'
import { getSpacing, Typo, Spacer } from 'ui/theme'

type DayMapping = {
  weekday: string
  fullWeekDay: string
  dayDate: number
  month: string
  fullMonth: string
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
    <View>
      <Spacer.TopScreen />
      <BottomBar />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {dates.map((date) => {
          const day = extractDate(date)
          const { weekday, fullWeekDay, dayDate, month, fullMonth, timestamp } = day
          const isSelected = selectedDate.getTime() === timestamp

          const { CalendarCell, CalendarText } = StatusPattern[isSelected ? 'selected' : 'default']
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
    </View>
  )
}

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

const DefaultCalendarCell = styled(TouchableOpacity)({
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
})
const SelectedCalendarCell = styled(DefaultCalendarCell)({})

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
    CalendarCell: DefaultCalendarCell,
    CalendarText: DefaultCalendarText,
  },
  selected: {
    CalendarCell: SelectedCalendarCell,
    CalendarText: SelectedCalendarText,
  },
}
