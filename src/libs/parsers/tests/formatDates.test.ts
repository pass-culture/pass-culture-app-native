import mockdate from 'mockdate'
import timezoneMock from 'timezone-mock'

import {
  formatDatePeriod,
  formatDateToISOStringWithoutTime,
  formatDates,
  getUniqueSortedTimestamps,
  formatToCompleteFrenchDate,
  formatToFrenchDate,
} from '../formatDates'

const Oct5 = new Date(2020, 9, 5)
const Nov1 = new Date(2020, 10, 1)
const Nov12 = new Date(2020, 10, 12)
const Nov20Morning = new Date(2020, 10, 20, 9, 30)
const Nov20Evening = new Date(2020, 10, 20, 21)
const Dec5 = new Date(2020, 11, 5)
const Jan2021 = new Date(2021, 0, 5)

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

describe('formatToFrenchDate', () => {
  beforeAll(() => {
    mockdate.set(Nov1)
  })

  it.each`
    date                                        | expected
    ${Nov12}                                    | ${'12 novembre 2020'}
    ${Oct5}                                     | ${'5 octobre 2020'}
    ${Oct5.valueOf()}                           | ${'5 octobre 2020'}
    ${{ day: 5, month: 'octobre', year: 2020 }} | ${'5 octobre 2020'}
    ${'2030-02-05T00:00:00Z'}                   | ${'5 février 2030'}
    ${Nov12.toString()}                         | ${'12 novembre 2020'}
  `('formatToFrenchDate($dates) \t= $expected', ({ date, expected }) => {
    expect(formatToFrenchDate(date)).toBe(expected)
  })
})

describe('formatDatePeriod', () => {
  beforeAll(() => {
    mockdate.set(Nov1)
  })
  it.each`
    dates                           | expected
    ${[]}                           | ${undefined}
    ${[Nov12]}                      | ${'12 novembre 2020'}
    ${[Nov12, Nov12]}               | ${'12 novembre 2020'}
    ${[Nov20Morning, Nov20Evening]} | ${'20 novembre 2020'}
    ${[Dec5]}                       | ${'5 décembre 2020'}
    ${[Nov12, Nov12]}               | ${'12 novembre 2020'}
    ${[Nov1, Nov12, Oct5]}          | ${'Du 1 au 12 novembre 2020'}
    ${[Dec5, Nov12]}                | ${'Du 12 novembre au 5 décembre 2020'}
    ${[Jan2021, Nov12]}             | ${'Du 12 novembre 2020 au 5 janvier 2021'}
  `('formatDatePeriod($dates) \t= $expected', ({ dates, expected }) => {
    expect(formatDatePeriod(dates)).toBe(expected)
  })
})

describe('getUniqueSortedTimestamps', () => {
  beforeAll(() => {
    mockdate.set(Nov1)
  })
  it.each`
    dates                               | uniqueSortedDates
    ${[]}                               | ${[]}
    ${[Nov1, Nov12, Oct5]}              | ${[Nov1, Nov12]}
    ${[Nov1, Nov12, Oct5, Nov1, Nov12]} | ${[Nov1, Nov12]}
    ${[Nov1, Nov12, Oct5, Nov12, Oct5]} | ${[Nov1, Nov12]}
  `(
    'getUniqueSortedTimestamps($dates) returns $uniqueSortedDates',
    ({ dates, uniqueSortedDates }: { dates: Date[]; uniqueSortedDates: Date[] }) => {
      const timestamps = dates.map((date) => date.valueOf())
      const uniqueSortedTimestamps = uniqueSortedDates.map((date) => date.valueOf())
      expect(getUniqueSortedTimestamps(timestamps)).toEqual(uniqueSortedTimestamps)
    }
  )
})

describe('formatDateToISOStringWithoutTime() - Brazil/East', () => {
  afterAll(() => timezoneMock.unregister())

  it.each([
    [31, 12, 2020, '2020-12-31'],
    [1, 12, 2020, '2020-12-01'],
    [1, 12, 2020, '2020-12-01'],
    [13, 6, 2001, '2001-06-13'],
  ])(
    'should format Date $year / $month / $day to string "$expectedISOString"',
    (day, month, year, expectedISOString) => {
      timezoneMock.register('Brazil/East')
      const date = new Date(year, month - 1, day)
      expect(formatDateToISOStringWithoutTime(date)).toEqual(expectedISOString)
    }
  )
})

describe('formatDateToISOStringWithoutTime() - Europe/London', () => {
  afterAll(() => timezoneMock.unregister())

  it.each([
    [31, 12, 2020, '2020-12-31'],
    [1, 12, 2020, '2020-12-01'],
    [1, 12, 2020, '2020-12-01'],
    [13, 6, 2001, '2001-06-13'],
  ])(
    'should format Date $year / $month / $day to string "$expectedISOString"',
    (day, month, year, expectedISOString) => {
      timezoneMock.register('Europe/London')
      const date = new Date(year, month - 1, day)
      expect(formatDateToISOStringWithoutTime(date)).toEqual(expectedISOString)
    }
  )
})

describe('formatToCompleteFrenchDate()', () => {
  it.each`
    date                     | expectedString
    ${new Date(2020, 0, 12)} | ${'Dimanche 12 janvier 2020'}
    ${new Date(2020, 0, 13)} | ${'Lundi 13 janvier 2020'}
    ${new Date(2019, 5, 18)} | ${'Mardi 18 juin 2019'}
    ${new Date(2020, 1, 19)} | ${'Mercredi 19 février 2020'}
    ${new Date(2020, 1, 27)} | ${'Jeudi 27 février 2020'}
    ${new Date(2020, 2, 27)} | ${'Vendredi 27 mars 2020'}
    ${new Date(2020, 3, 25)} | ${'Samedi 25 avril 2020'}
  `(
    'should format Date $date to string "$expectedString"',
    ({ date, expectedString }: { date: Date; expectedString: string }) => {
      expect(formatToCompleteFrenchDate(date)).toEqual(expectedString)
    }
  )
})
