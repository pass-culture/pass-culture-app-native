import { addDays, differenceInCalendarDays, format } from 'date-fns'
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking'

type Colors = { primary: string; white: string }

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd')

export function getMarkedDates(
  selectedStartDate: Date | undefined,
  selectedEndDate: Date | undefined,
  colors: Colors
): Record<string, MarkingProps> | undefined {
  if (!selectedStartDate) return undefined

  if (!selectedEndDate) {
    return {
      [formatDate(selectedStartDate)]: {
        startingDay: true,
        endingDay: true,
        color: colors.primary,
        textColor: colors.white,
      },
    }
  }

  // +1 to include end date
  const dayCount = differenceInCalendarDays(selectedEndDate, selectedStartDate) + 1

  const marked: Record<string, MarkingProps> = {}

  Array.from({ length: dayCount }).forEach((_, index) => {
    const date = addDays(selectedStartDate, index)
    const dateString = formatDate(date)

    marked[dateString] = {
      color: colors.primary,
      textColor: colors.white,
      startingDay: index === 0,
      endingDay: index === dayCount - 1,
    }
  })

  return marked
}
