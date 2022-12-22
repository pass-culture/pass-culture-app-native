import { format, isBefore, isSameDay } from 'date-fns'

export const computeDateRangeDisplay = (beginningDate: Date, endingDate: Date): string | null => {
  const isAlreadyEnded = isBefore(endingDate, new Date())
  if (isAlreadyEnded) return null

  if (isSameDay(beginningDate, endingDate)) {
    return `le ${formatDate(beginningDate)}`
  } else {
    return `du ${formatDate(beginningDate)} au ${formatDate(endingDate)}`
  }
}

const formatDate = (date: Date) => format(date, `dd/MM`)
