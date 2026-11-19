import { addDays, isAfter, startOfDay } from 'date-fns'

export const isDateNotWithinNextNbDays = (referenceDate: Date, targetDate: Date, nbDays: number) =>
  isAfter(targetDate, addDays(startOfDay(referenceDate), nbDays))
