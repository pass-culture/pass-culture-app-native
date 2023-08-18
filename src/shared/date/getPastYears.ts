import range from 'lodash/range'

export function getPastYears(startYear: number, currentYear: string) {
  return range(startYear, parseInt(currentYear) + 1, 1)
    .reverse()
    .map((year) => year.toString())
}
