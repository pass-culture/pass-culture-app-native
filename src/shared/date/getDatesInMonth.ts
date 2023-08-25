import range from 'lodash/range'

/**
 * Returns a list of dates in string such as ["1", "2", ..., "31"].
 * Example :
 * ```ts
 * getDatesInMonth(1, "2009") // february 2009 --> ["1", "2", "3", ..., "27", "28"]
 * ```
 * @param monthIndex Integer value representing the month, beginning with 0 for January to 11 for December
 * @param year String value representing the year
 */
export function getDatesInMonth(month: string, year: string) {
  const nextMonthIndex = Number(month) + 1
  const nbOfDaysInMonth = new Date(Number(year), nextMonthIndex, 0).getDate()
  return range(1, nbOfDaysInMonth + 1).map((day) => day.toString())
}
