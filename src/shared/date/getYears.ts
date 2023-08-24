import range from 'lodash/range'

export function getYears(startYear: number, numberOfYears: number) {
  const endYear = startYear + numberOfYears
  return range(startYear, endYear, 1).map((year) => year.toString())
}
