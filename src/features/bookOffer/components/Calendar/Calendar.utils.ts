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
export const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
export const dayNamesShort = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

const EARLIEST_YEAR_AVAILABLE = new Date().getFullYear() - 50
export const YEAR_LIST = Array.from(new Array(100)).map(
  (item, index) => EARLIEST_YEAR_AVAILABLE + index
)

/**
 * Returns a list of dates such as [1, 2, ..., 31].
 * Example :
 * ```ts
 * getListOfDatesInMonth(1, 2009) // february 2009 --> [1, 2, 3, ..., 27, 28]
 * ```
 * @param monthIndex Integer value representing the month, beginning with 0 for January to 11 for December
 * @param year Integer value representing the year
 */
export function getListOfDatesInMonth(monthIndex: number, year: number) {
  const nextMonthIndex = monthIndex + 1
  const nbOfDaysInMonth = new Date(year, nextMonthIndex, 0).getDate()
  return range(1, nbOfDaysInMonth + 1)
}
