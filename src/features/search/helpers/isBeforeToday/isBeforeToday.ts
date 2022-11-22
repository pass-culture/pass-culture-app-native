import { isBefore } from 'date-fns'

export const isBeforeToday = (year: number, month: number, day: number) => {
  const today = new Date(new Date().setHours(0, 0, 0, 0))
  const dateToCompare = new Date(new Date(year, month, day).setHours(0, 0, 0, 0))
  return isBefore(dateToCompare, today)
}
