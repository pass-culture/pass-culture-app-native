import timezoneMock, { TimeZone } from 'timezone-mock'

import {
  getDatesInMonth,
  getDateValuesString,
  getPastYears,
  getYears,
} from 'features/bookOffer/components/Calendar/Calendar.utils'

describe('Calendar.utils', () => {
  describe('getDatesInMonth()', () => {
    it.each`
      timezone
      ${'Australia/Adelaide'}
      ${'Europe/London'}
      ${'Brazil/East'}
    `(
      'should return a list [1, 2, ..., N] for some specified month and year with timezone $timezone',
      ({ timezone }: { timezone: TimeZone }) => {
        timezoneMock.register(timezone)

        expect(getDatesInMonth('9', '2021')).toEqual(getArrayOfStrings(31)) // october 2021 has 31 days
        expect(getDatesInMonth('10', '2021')).toEqual(getArrayOfStrings(30)) // november 2021 has 30 days
        expect(getDatesInMonth('1', '2009')).toEqual(getArrayOfStrings(28)) // february 2009 has 28 days
        expect(getDatesInMonth('1', '2008')).toEqual(getArrayOfStrings(29)) // february 2008 has 29 days
      }
    )
  })

  describe('getYears', () => {
    it('should return an array of years as strings', () => {
      const startYear = 2020
      const numberOfYears = 3
      const expectedOutput = ['2020', '2021', '2022']
      const result = getYears(startYear, numberOfYears)
      expect(result).toEqual(expectedOutput)
    })

    it('should return an empty array if numberOfYears is zero', () => {
      const startYear = 2020
      const numberOfYears = 0
      const expectedOutput: string[] = []
      const result = getYears(startYear, numberOfYears)
      expect(result).toEqual(expectedOutput)
    })

    it('should not handle negative values of numberOfYears', () => {
      const startYear = 2020
      const numberOfYears = -3
      const expectedOutput: string[] = []
      const result = getYears(startYear, numberOfYears)
      expect(result).toEqual(expectedOutput)
    })

    it('should handle startYear as a negative value', () => {
      const startYear = -5
      const numberOfYears = 5
      const expectedOutput = ['-5', '-4', '-3', '-2', '-1']
      const result = getYears(startYear, numberOfYears)
      expect(result).toEqual(expectedOutput)
    })
  })

  describe('getPastYears', () => {
    it('should return an array of years as strings in descending order', () => {
      const startYear = 2015
      const currentYear = '2023'
      const expectedOutput = [
        '2023',
        '2022',
        '2021',
        '2020',
        '2019',
        '2018',
        '2017',
        '2016',
        '2015',
      ]
      const result = getPastYears(startYear, currentYear)
      expect(result).toEqual(expectedOutput)
    })

    it('should return an empty array if startYear is greater than currentYear', () => {
      const startYear = 2023
      const currentYear = '2022'
      const expectedOutput: string[] = []
      const result = getPastYears(startYear, currentYear)
      expect(result).toEqual(expectedOutput)
    })

    it('should return an empty array if currentYear is not a valid number', () => {
      const startYear = 2015
      const currentYear = 'not a number'
      const expectedOutput: string[] = []
      const result = getPastYears(startYear, currentYear)
      expect(result).toEqual(expectedOutput)
    })

    it('should handle startYear as a negative value', () => {
      const startYear = -5
      const currentYear = '5'
      const expectedOutput = ['5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4', '-5']
      const result = getPastYears(startYear, currentYear)
      expect(result).toEqual(expectedOutput)
    })
  })

  describe('getDateValuesString', () => {
    it('should return an object with day, month and year as strings with the date values', () => {
      const selectedDate = new Date('2022-01-31T12:00:00.000Z')
      const expectedOutput = { day: '31', month: 'Janv.', year: '2022' }
      const result = getDateValuesString(selectedDate)
      expect(result).toEqual(expectedOutput)
    })
  })
})

function getArrayOfStrings(day: number): string[] {
  return Array.from({ length: day }, (_, i) => (i + 1).toString())
}
