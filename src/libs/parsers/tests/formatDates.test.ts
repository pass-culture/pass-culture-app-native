import mockdate from 'mockdate'
import timezoneMock from 'timezone-mock'

import {
  formatDatePeriod,
  formatDateToISOStringWithoutTime,
  formatDates,
  getUniqueSortedTimestamps,
  formatToCompleteFrenchDate,
  formatToFrenchDate,
  getFormattedDates,
  groupByYearAndMonth,
  decomposeDate,
  joinArrayElement,
  GroupResult,
  formatGroupedDates,
} from '../formatDates'

const OCTOBER_5_2020 = new Date(2020, 9, 5)
const NOVEMBER_1_2020 = new Date(2020, 10, 1)
const NOVEMBER_12_2020 = new Date(2020, 10, 12)
const NOVEMBER_13_2020 = new Date(2020, 10, 13)
const DECEMBER_14_2020 = new Date(2020, 11, 14)
const NOVEMBER_20_2020_MORNING = new Date(2020, 10, 20, 9, 30)
const NOVEMBER_20_2020_EVENING = new Date(2020, 10, 20, 21)
const DECEMBER_5_2020 = new Date(2020, 11, 5)
const JANUARY_5_2021 = new Date(2021, 0, 5)
const JANUARY_15_2021 = new Date(2021, 0, 15)
const JANUARY_25_2021 = new Date(2021, 0, 25)
const AUGUST_5_2021 = new Date(2021, 7, 5)
const SEPTEMBER_5_2021 = new Date(2021, 8, 5)
const OCTOBER_5_2021 = new Date(2021, 9, 5)
const NOVEMBER_13_2021 = new Date(2021, 10, 13)
const FEBRUARY_2_2022 = new Date(2022, 1, 2)

describe('groupByYearAndMonth', () => {
  it('should group an array of decomposed dates by year and month', () => {
    const decomposedDates: ReturnType<typeof decomposeDate>[] = [
      { year: 2022, month: 'janvier', day: 1 },
      { year: 2022, month: 'janvier', day: 15 },
      { year: 2022, month: 'février', day: 10 },
      { year: 2023, month: 'mars', day: 21 },
      { year: 2023, month: 'mars', day: 22 },
      { year: 2023, month: 'avril', day: 5 },
    ]

    const result = groupByYearAndMonth(decomposedDates)

    const grouped = {
      2022: {
        janvier: [1, 15],
        février: [10],
      },
      2023: {
        mars: [21, 22],
        avril: [5],
      },
    }

    expect(result).toEqual(grouped)
  })

  it('should return an empty object for an empty array', () => {
    const result = groupByYearAndMonth([])

    expect(result).toEqual({})
  })
})

describe('joinArrayElement', () => {
  it('should return the single element when given an array with only one element', () => {
    expect(joinArrayElement([1])).toEqual(1)
  })

  it('should return two elements joined with "et"', () => {
    expect(joinArrayElement(['novembre', 'octobre'])).toEqual('novembre et octobre')
  })

  it('should return three or more elements joined with commas and "et"', () => {
    expect(joinArrayElement([1, 2, 3])).toEqual('1, 2 et 3')
    expect(joinArrayElement(['foo', 'bar', 'baz'])).toEqual('foo, bar et baz')
  })

  it('should return undefined when the array is empty', () => {
    expect(joinArrayElement([])).toEqual(undefined)
  })
})

describe('formatGroupedDates', () => {
  it('should correctly format grouped dates with single day', () => {
    const grouped: GroupResult = {
      '2023': {
        mars: [7],
      },
    }
    const expected = {
      formatDates: ['le 7 mars 2023'],
      arrayDays: [[7]],
    }
    const result = formatGroupedDates(grouped)
    expect(result.formatDates).toEqual(expected.formatDates)
    expect(result.arrayDays).toEqual(expected.arrayDays)
  })

  it('should correctly format grouped dates with multiple days', () => {
    const grouped: GroupResult = {
      '2022': {
        janvier: [1, 2],
        février: [4, 5, 6],
      },
      '2023': {
        mars: [7, 8, 9, 10],
      },
    }
    const expected = {
      formatDates: [
        'les 1 et 2 janvier 2022',
        'les 4, 5 et 6 février 2022',
        'les 7, 8, 9 et 10 mars 2023',
      ],
      arrayDays: [
        [1, 2],
        [4, 5, 6],
        [7, 8, 9, 10],
      ],
    }
    const result = formatGroupedDates(grouped)
    expect(result.formatDates).toEqual(expected.formatDates)
    expect(result.arrayDays).toEqual(expected.arrayDays)
  })

  it('should return empty arrays when given an empty object', () => {
    const grouped: GroupResult = {}
    const expected = {
      formatDates: [],
      arrayDays: [],
    }
    const result = formatGroupedDates(grouped)
    expect(result.formatDates).toEqual(expected.formatDates)
    expect(result.arrayDays).toEqual(expected.arrayDays)
  })
})

describe('getFormattedDates', () => {
  beforeAll(() => {
    mockdate.set(NOVEMBER_1_2020)
  })

  it('should return undefined when undefined or empty array is given', () => {
    expect(getFormattedDates(undefined)).toEqual(undefined)
    expect(getFormattedDates([])).toEqual(undefined)
  })

  it('should return only future dates', () => {
    expect(
      getFormattedDates([OCTOBER_5_2020.toISOString(), NOVEMBER_12_2020.toISOString()])
    ).toEqual(formatToFrenchDate(NOVEMBER_12_2020))
  })

  it('should return undefined when the array dates are invalid', () => {
    const dates = ['invalid date']
    const result = getFormattedDates(dates)
    expect(result).toEqual(undefined)
  })

  it('should return a formatted date when array contains only one unique date', () => {
    const result = getFormattedDates([DECEMBER_14_2020.toISOString()])
    expect(result).toEqual('14 décembre 2020')
  })

  it('should return a formatted string of 1 date when array contains two similar dates', () => {
    const result = getFormattedDates([
      DECEMBER_14_2020.toISOString(),
      DECEMBER_14_2020.toISOString(),
    ])
    expect(result).toEqual('14 décembre 2020')
  })

  it('should return a formatted string date of two dates with the same month', () => {
    const result = getFormattedDates([
      NOVEMBER_12_2020.toISOString(),
      NOVEMBER_13_2020.toISOString(),
    ])
    expect(result).toEqual('les 12 et 13 novembre 2020')
  })

  it('should return a formatted string date of 1 date when array contains two same dates with different hour', () => {
    const result = getFormattedDates([
      NOVEMBER_20_2020_MORNING.toISOString(),
      NOVEMBER_20_2020_EVENING.toISOString(),
    ])
    expect(result).toEqual('le 20 novembre 2020')
  })

  it('should return a formatted string date of 2 dates with the same day, same month but different years', () => {
    const result = getFormattedDates([
      NOVEMBER_13_2020.toISOString(),
      NOVEMBER_13_2021.toISOString(),
    ])
    expect(result).toEqual('le 13 novembre 2020 et le 13 novembre 2021')
  })

  it('should return a formatted string date including three dates with different months', () => {
    const result = getFormattedDates([
      AUGUST_5_2021.toISOString(),
      SEPTEMBER_5_2021.toISOString(),
      OCTOBER_5_2021.toISOString(),
    ])
    expect(result).toEqual('le 5 août 2021, le 5 septembre 2021 et le 5 octobre 2021')
  })

  it('should return a formatted string date including three dates, with two dates of different month in the same year and one date of different month and year', () => {
    const result = getFormattedDates([
      JANUARY_5_2021.toISOString(),
      OCTOBER_5_2021.toISOString(),
      FEBRUARY_2_2022.toISOString(),
    ])
    expect(result).toEqual('le 5 janvier 2021, le 5 octobre 2021 et le 2 février 2022')
  })

  it('should return a formatted string date including three dates, with two dates of the same month and year and one date of different month in a different year', () => {
    const result = getFormattedDates([
      JANUARY_5_2021.toISOString(),
      JANUARY_15_2021.toISOString(),
      FEBRUARY_2_2022.toISOString(),
    ])
    expect(result).toEqual('les 5 et 15 janvier 2021 et le 2 février 2022')
  })

  it('should return a formatted string date including 4 dates in the same year, with 2 dates of different months and 2 dates in the same month', () => {
    const result = getFormattedDates([
      JANUARY_5_2021.toISOString(),
      JANUARY_15_2021.toISOString(),
      OCTOBER_5_2021.toISOString(),
      SEPTEMBER_5_2021.toISOString(),
    ])
    expect(result).toEqual('les 5 et 15 janvier 2021, le 5 septembre 2021 et le 5 octobre 2021')
  })

  it('should return a formatted string date including 4 dates, with 1 date of a different month and 3 dates in the same month', () => {
    const result = getFormattedDates([
      JANUARY_5_2021.toISOString(),
      JANUARY_15_2021.toISOString(),
      JANUARY_25_2021.toISOString(),
      OCTOBER_5_2021.toISOString(),
    ])
    expect(result).toEqual('les 5, 15 et 25 janvier 2021 et le 5 octobre 2021')
  })

  it('should return a formatted string date including 4 dates, with 1 date of a different month and year and 3 dates in the same month and year', () => {
    const result = getFormattedDates([
      JANUARY_5_2021.toISOString(),
      JANUARY_15_2021.toISOString(),
      JANUARY_25_2021.toISOString(),
      FEBRUARY_2_2022.toISOString(),
    ])
    expect(result).toEqual('les 5, 15 et 25 janvier 2021 et le 2 février 2022')
  })

  it('should return a formatted string date including 5 dates within a period range', () => {
    expect(
      getFormattedDates([
        NOVEMBER_12_2020.toISOString(),
        NOVEMBER_13_2020.toISOString(),
        JANUARY_5_2021.toISOString(),
        JANUARY_25_2021.toISOString(),
        FEBRUARY_2_2022.toISOString(),
      ])
    ).toEqual('Du 12 novembre 2020 au 2 février 2022')
  })
})

describe('formatDates', () => {
  beforeAll(() => {
    mockdate.set(NOVEMBER_1_2020)
  })

  it.each`
    dates                                   | expected
    ${undefined}                            | ${undefined}
    ${[]}                                   | ${undefined}
    ${[NOVEMBER_12_2020]}                   | ${'12 novembre 2020'}
    ${[NOVEMBER_12_2020, NOVEMBER_12_2020]} | ${'12 novembre 2020'}
    ${[DECEMBER_5_2020]}                    | ${'5 décembre 2020'}
    ${[DECEMBER_5_2020, NOVEMBER_12_2020]}  | ${'Dès le 12 novembre 2020'}
    ${[DECEMBER_5_2020, -NOVEMBER_12_2020]} | ${'5 décembre 2020'}
    ${[OCTOBER_5_2020, OCTOBER_5_2020]}     | ${undefined}
    ${[OCTOBER_5_2020, NOVEMBER_12_2020]}   | ${'12 novembre 2020'}
  `('formatDates($dates) \t= $expected', ({ dates, expected }) => {
    const timestampsInSeconds = dates && dates.map((date: Date) => date.valueOf())
    expect(formatDates(timestampsInSeconds)).toEqual(expected)
  })
})

describe('formatToFrenchDate', () => {
  beforeAll(() => {
    mockdate.set(NOVEMBER_1_2020)
  })

  it.each`
    date                                        | expected
    ${NOVEMBER_12_2020}                         | ${'12 novembre 2020'}
    ${OCTOBER_5_2020}                           | ${'5 octobre 2020'}
    ${OCTOBER_5_2020.valueOf()}                 | ${'5 octobre 2020'}
    ${{ day: 5, month: 'octobre', year: 2020 }} | ${'5 octobre 2020'}
    ${'2030-02-05T00:00:00Z'}                   | ${'5 février 2030'}
    ${NOVEMBER_12_2020.toString()}              | ${'12 novembre 2020'}
  `('formatToFrenchDate($dates) \t= $expected', ({ date, expected }) => {
    expect(formatToFrenchDate(date)).toEqual(expected)
  })
})

describe('formatDatePeriod', () => {
  it('should return a formatted string date for a period of one day', () => {
    expect(
      formatDatePeriod([
        new Date('2023-04-10T10:00:00Z').getTime(),
        new Date('2023-04-10T23:59:59Z').getTime(),
      ])
    ).toEqual('10 avril 2023')
  })

  it('should return a formatted string date for a period of multiple days in the same month and year', () => {
    expect(
      formatDatePeriod([
        new Date('2023-04-10T10:00:00Z').getTime(),
        new Date('2023-04-15T23:59:59Z').getTime(),
      ])
    ).toEqual('Du 10 au 15 avril 2023')
  })

  it('should return a formatted string date for a period of multiple days in different months of the same year', () => {
    expect(
      formatDatePeriod([
        new Date('2023-04-30T10:00:00Z').getTime(),
        new Date('2023-05-05T23:59:59Z').getTime(),
      ])
    ).toEqual('Du 30 avril au 5 mai 2023')
  })

  it('should return a formatted string date for a period of multiple days in different years', () => {
    expect(
      formatDatePeriod([
        new Date('2022-12-24T10:00:00Z').getTime(),
        new Date('2023-01-02T23:59:59Z').getTime(),
      ])
    ).toEqual('Du 24 décembre 2022 au 2 janvier 2023')
  })
})

describe('getUniqueSortedTimestamps', () => {
  beforeAll(() => {
    mockdate.set(NOVEMBER_1_2020)
  })
  it.each`
    dates                                                                                     | uniqueSortedDates
    ${[]}                                                                                     | ${[]}
    ${[NOVEMBER_1_2020, NOVEMBER_12_2020, OCTOBER_5_2020]}                                    | ${[NOVEMBER_1_2020, NOVEMBER_12_2020]}
    ${[NOVEMBER_1_2020, NOVEMBER_12_2020, OCTOBER_5_2020, NOVEMBER_1_2020, NOVEMBER_12_2020]} | ${[NOVEMBER_1_2020, NOVEMBER_12_2020]}
    ${[NOVEMBER_1_2020, NOVEMBER_12_2020, OCTOBER_5_2020, NOVEMBER_12_2020, OCTOBER_5_2020]}  | ${[NOVEMBER_1_2020, NOVEMBER_12_2020]}
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
