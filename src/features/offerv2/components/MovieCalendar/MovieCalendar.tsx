import React from 'react'
import { View, ScrollView } from 'react-native'
import { Timestamp } from 'react-native-reanimated/lib/types/lib/reanimated2/commonTypes'
import styled from 'styled-components/native'

import { DAYS, SHORT_DAYS } from 'shared/date/days'
import { Month, MONTHS, SHORT_MONTHS } from 'shared/date/months'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
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
  return {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    weekday: SHORT_DAYS[dayIndex],
    // @ts-expect-error: because of noUncheckedIndexedAccess
    fullWeekDay: DAYS[dayIndex],
    dayDate,
    // @ts-expect-error: because of noUncheckedIndexedAccess
    month: SHORT_MONTHS[monthIndex],
    // @ts-expect-error: because of noUncheckedIndexedAccess
    fullMonth: MONTHS[monthIndex],
    timestamp,
  }
}

type Props = {
  dates: Date[]
  selectedDate: Date | undefined
  onTabChange: (date: Date) => void
  scrollViewRef?: React.MutableRefObject<ScrollView | null>
}

export const MovieCalendar: React.FC<Props> = ({
  dates,
  selectedDate,
  onTabChange,
  scrollViewRef,
}) => {
  return (
    <Container>
      <BottomBar />
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={scrollViewContainer}>
        {dates.map((date) => {
          const { weekday, fullWeekDay, dayDate, month, fullMonth, timestamp } = extractDate(date)
          const isSelected =
            selectedDate === undefined ? false : selectedDate.getTime() === timestamp

          const { CalendarText } = StatusPattern[isSelected ? 'selected' : 'default']
          return (
            <CalendarCell onPress={() => onTabChange(date)} key={`${timestamp} - ${isSelected}`}>
              <CalendarTextView accessibilityLabel={`${fullWeekDay} ${dayDate} ${fullMonth}`}>
                <CalendarText numberOfLines={1}>{weekday}</CalendarText>
                <CalendarText numberOfLines={1}>{dayDate}</CalendarText>
                <CalendarText numberOfLines={1}>{month}</CalendarText>
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

const scrollViewContainer = { paddingHorizontal: getSpacing(6) }

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
