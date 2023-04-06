import range from 'lodash/range'

export const monthNames = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
]
export const monthNamesShort = [
  'Janv.',
  'Févr.',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juil.',
  'Août',
  'Sept.',
  'Oct.',
  'Nov.',
  'Déc.',
]

export const dayNumbers = range(1, 31 + 1).map((num) => String(num))
export const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
export const dayNamesShort = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

export function getYears(startYear: number, numberOfYears: number) {
  const endYear = startYear + numberOfYears
  return range(startYear, endYear, 1).map((year) => year.toString())
}

export function getPastYears(startYear: number, currentYear: string) {
  return range(startYear, parseInt(currentYear) + 1, 1)
    .reverse()
    .map((year) => year.toString())
}

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

export function getDateValuesString(selectedDate: Date) {
  return {
    day: selectedDate.getDate().toString(),
    month: monthNamesShort[selectedDate.getMonth()],
    year: selectedDate.getFullYear().toString(),
  }
}
