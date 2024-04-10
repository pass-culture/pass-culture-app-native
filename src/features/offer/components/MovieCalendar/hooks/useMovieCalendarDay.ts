import { useMemo } from 'react'
import { useTheme } from 'styled-components/native'

import { DAYS, FullWeekDay, SHORT_DAYS, ShortWeekDay } from 'shared/date/days'
import {
  CAPITALIZED_MONTHS,
  CAPITALIZED_SHORT_MONTHS,
  CapitalizedMonth,
  CapitalizedShortMonth,
} from 'shared/date/months'

export const useMovieCalendarDay = (date: Date, selectedDate: Date | undefined) => {
  const { isDesktopViewport } = useTheme()

  const { dayDate, shortWeekDay, fullWeekDay, fullMonth, timestamp, shortMonth } = useMemo(
    () => extractDate(date),
    [date]
  )

  const isSelected = useMemo(
    () => (selectedDate === undefined ? false : selectedDate.getTime() === timestamp),
    [selectedDate, timestamp]
  )

  return {
    accessibilityLabel: `${fullWeekDay} ${dayDate} ${fullMonth}`,
    weekDay: isDesktopViewport ? fullWeekDay : shortWeekDay,
    month: isDesktopViewport ? fullMonth : shortMonth,
    dayDate,
    isSelected,
  }
}

type DayMapping = {
  shortWeekDay: ShortWeekDay
  fullWeekDay: FullWeekDay
  dayDate: number
  shortMonth: CapitalizedShortMonth
  fullMonth: CapitalizedMonth
  timestamp: number
}

const extractDate = (date: Date): DayMapping => {
  const dayIndex = date.getDay()
  const monthIndex = date.getMonth()
  const dayDate = date.getDate()
  const timestamp = date.getTime()
  return {
    shortWeekDay: SHORT_DAYS[dayIndex],
    fullWeekDay: DAYS[dayIndex],
    dayDate,
    shortMonth: CAPITALIZED_SHORT_MONTHS[monthIndex],
    fullMonth: CAPITALIZED_MONTHS[monthIndex],
    timestamp,
  }
}
