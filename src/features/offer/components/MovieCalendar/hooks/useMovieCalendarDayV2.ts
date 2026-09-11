import { useMemo } from 'react'
import { useTheme } from 'styled-components/native'

import { DAYS, FullWeekDay, SHORT_DAYS, ShortWeekDay } from 'shared/date/days'
import {
  CAPITALIZED_MONTHS,
  CAPITALIZED_SHORT_MONTHS,
  CapitalizedMonth,
  CapitalizedShortMonth,
} from 'shared/date/months'

export const useMovieCalendarDayV2 = (date: string, selectedDate: string | undefined) => {
  const { isDesktopViewport } = useTheme()

  const { dayDate, shortWeekDay, fullWeekDay, fullMonth, shortMonth } = useMemo(
    () => extractDateV2(date),
    [date]
  )

  const isSelected = useMemo(
    () => (selectedDate ? date === selectedDate : false),
    [selectedDate, date]
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
}

export const extractDateV2 = (date: string): DayMapping => {
  const dateObj = new Date(date)
  const dayIndex = dateObj.getDay()
  const monthIndex = dateObj.getMonth()
  const dayDate = dateObj.getDate()
  return {
    shortWeekDay: SHORT_DAYS[dayIndex],
    fullWeekDay: DAYS[dayIndex],
    dayDate,
    shortMonth: CAPITALIZED_SHORT_MONTHS[monthIndex],
    fullMonth: CAPITALIZED_MONTHS[monthIndex],
  }
}
