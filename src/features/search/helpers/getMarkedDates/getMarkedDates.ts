import { addDays, differenceInCalendarDays, format } from 'date-fns'
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking'

import { MarkedDatesColors } from 'features/search/types'

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd')

export function getMarkedDates(
  selectedStartDate: Date | undefined,
  selectedEndDate: Date | undefined,
  colors: MarkedDatesColors
): Record<string, MarkingProps> | undefined {
  if (!selectedStartDate) return undefined

  if (!selectedEndDate) {
    return {
      [formatDate(selectedStartDate)]: {
        startingDay: true,
        endingDay: true,
        color: colors.backgroundColor,
        textColor: colors.textColor,
      },
    }
  }

  // +1 to include end date
  const dayCount = differenceInCalendarDays(selectedEndDate, selectedStartDate) + 1

  const marked = Array.from({ length: dayCount }).reduce<Record<string, MarkingProps>>(
    (acc, _, index) => {
      const date = addDays(selectedStartDate, index)
      const dateString = formatDate(date)

      acc[dateString] = {
        color: colors.backgroundColor,
        textColor: colors.textColor,
        startingDay: index === 0,
        endingDay: index === dayCount - 1,
      }

      return acc
    },
    {}
  )

  return marked
}
