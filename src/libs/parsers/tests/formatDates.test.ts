import mockdate from 'mockdate'

import {
  formatDatePeriod,
  formatDateToISOStringWithoutTime,
  formatDates,
  getUniqueSortedTimestamps,
  formatToCompleteFrenchDate,
} from '../formatDates'

const Oct5 = new Date(2020, 9, 5)
const Nov1 = new Date(2020, 10, 1)
const Nov12 = new Date(2020, 10, 12)
const Dec5 = new Date(2020, 11, 5)

describe('formatDates', () => {
  beforeAll(() => {
    mockdate.set(Nov1)
  })

  it.each`
    dates             | expected
    ${undefined}      | ${undefined}
    ${[]}             | ${undefined}
    ${[Nov12]}        | ${'12 novembre 2020'}
    ${[Nov12, Nov12]} | ${'12 novembre 2020'}
    ${[Dec5]}         | ${'5 décembre 2020'}
    ${[Dec5, Nov12]}  | ${'Dès le 12 novembre 2020'}
    ${[Dec5, -Nov12]} | ${'5 décembre 2020'}
    ${[Oct5, Oct5]}   | ${undefined}
    ${[Oct5, Nov12]}  | ${'12 novembre 2020'}
  `('formatDates($dates) \t= $expected', ({ dates, expected }) => {
    const timestampsInSeconds = dates && dates.map((date: Date) => date.valueOf())
    expect(formatDates(timestampsInSeconds)).toBe(expected)
  })
})

describe('formatDatePeriod', () => {
  beforeAll(() => {
    mockdate.set(Nov1)
  })
  it.each`
    dates                  | expected
    ${[]}                  | ${undefined}
    ${[Nov12]}             | ${'12 novembre 2020'}
    ${[Nov12, Nov12]}      | ${'12 novembre 2020'}
    ${[Dec5]}              | ${'5 décembre 2020'}
    ${[Oct5, Oct5]}        | ${'5 octobre 2020'}
    ${[Dec5, Nov12]}       | ${'Du 12 novembre 2020 au 5 décembre 2020'}
    ${[Dec5, Nov12, Oct5]} | ${'Du 5 octobre 2020 au 5 décembre 2020'}
  `('formatDatePeriod($dates) \t= $expected', ({ dates, expected }) => {
    expect(formatDatePeriod(dates)).toBe(expected)
  })
})

describe('getUniqueSortedTimestamps', () => {
  beforeAll(() => {
    mockdate.set(Nov1)
  })
  it.each`
    dates                               | onlyFuture | uniqueSortedDates
    ${[]}                               | ${false}   | ${undefined}
    ${[Nov1, Nov12, Oct5]}              | ${false}   | ${[Oct5, Nov1, Nov12]}
    ${[Nov1, Nov12, Oct5]}              | ${true}    | ${[Nov1, Nov12]}
    ${[Nov1, Nov12, Oct5, Nov1, Nov12]} | ${false}   | ${[Oct5, Nov1, Nov12]}
    ${[Nov1, Nov12, Oct5, Nov12, Oct5]} | ${true}    | ${[Nov1, Nov12]}
  `(
    'getUniqueSortedTimestamps($dates) with onlyFuture:$onlyFuture option returns $uniqueSortedDates',
    ({
      dates,
      onlyFuture,
      uniqueSortedDates,
    }: {
      dates: Date[]
      onlyFuture: boolean
      uniqueSortedDates: Date[] | undefined
    }) => {
      const timestamps = dates.map((date) => date.valueOf())
      const uniqueSortedTimestamps = uniqueSortedDates?.map((date) => date.valueOf())
      expect(getUniqueSortedTimestamps(timestamps, onlyFuture)).toEqual(uniqueSortedTimestamps)
    }
  )
})

describe('formatDateToISOStringWithoutTime()', () => {
  it.each`
    date                            | expectedISOString
    ${new Date(666, 6, 6)}          | ${'0666-07-06'}
    ${new Date(100000, 6, 6)}       | ${'+100000-07-06'}
    ${new Date(2020, 11, 31)}       | ${'2020-12-31'}
    ${new Date(2020, 11, 1)}        | ${'2020-12-01'}
    ${new Date(2020, 11, 1, 9, 30)} | ${'2020-12-01'}
  `(
    'should format Date $date to string "$expectedISOString"',
    ({ date, expectedISOString }: { date: Date; expectedISOString: string }) => {
      expect(formatDateToISOStringWithoutTime(date)).toEqual(expectedISOString)
    }
  )
})

describe('formatToCompleteFrenchDate()', () => {
  it.each`
    date             | expectedString
    ${1578788130000} | ${'Dimanche 12 janvier 2020'}
    ${1578874530000} | ${'Lundi 13 janvier 2020'}
    ${1560813330000} | ${'Mardi 18 juin 2019'}
    ${1582071330000} | ${'Mercredi 19 février 2020'}
    ${1582762530000} | ${'Jeudi 27 février 2020'}
    ${1585268130000} | ${'Vendredi 27 mars 2020'}
    ${1587770130000} | ${'Samedi 25 avril 2020'}
  `(
    'should format Date $date to string "$expectedString"',
    ({ date, expectedString }: { date: number; expectedString: string }) => {
      expect(formatToCompleteFrenchDate(date)).toEqual(expectedString)
    }
  )
})
