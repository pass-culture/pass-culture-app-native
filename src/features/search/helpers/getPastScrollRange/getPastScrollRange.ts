import { differenceInMonths, startOfMonth } from 'date-fns'

export function getPastScrollRange(from: Date, to: Date): number {
  return Math.max(0, differenceInMonths(startOfMonth(from), startOfMonth(to)))
}
