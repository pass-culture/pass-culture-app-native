import { isBefore } from 'date-fns'

export const isBeforeToday = (year: string, month: string, day: string) => {
  const today = new Date(new Date().setHours(0, 0, 0, 0))
  const dateToCompare = new Date(
    new Date(Number(year), Number(month), Number(day)).setHours(0, 0, 0, 0)
  )
  return isBefore(dateToCompare, today)
}
