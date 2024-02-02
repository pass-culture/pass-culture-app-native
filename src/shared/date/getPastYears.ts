import range from 'lodash/range'

export function getPastYears(startYear: number, currentYear: number) {
  return range(startYear, currentYear + 1, 1)
    .reverse()
    .map((year) => year.toString())
}
