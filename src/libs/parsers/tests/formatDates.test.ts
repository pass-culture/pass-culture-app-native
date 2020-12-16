import mockdate from 'mockdate'

import { formatDatePeriod, formatDates, getUniqueSortedTimestamps } from '../formatDates'

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
    timestamps                                                                            | onlyFuture | uniqueSortedTimestamps
    ${[]}                                                                                 | ${false}   | ${undefined}
    ${[Nov1.getTime(), Nov12.getTime(), Oct5.getTime()]}                                  | ${false}   | ${[Oct5.getTime(), Nov1.getTime(), Nov12.getTime()]}
    ${[Nov1.getTime(), Nov12.getTime(), Oct5.getTime()]}                                  | ${true}    | ${[Nov1.getTime(), Nov12.getTime()]}
    ${[Nov1.getTime(), Nov12.getTime(), Oct5.getTime(), Nov1.getTime(), Nov12.getTime()]} | ${false}   | ${[Oct5.getTime(), Nov1.getTime(), Nov12.getTime()]}
    ${[Nov1.getTime(), Nov12.getTime(), Oct5.getTime(), Nov12.getTime(), Oct5.getTime()]} | ${true}    | ${[Nov1.getTime(), Nov12.getTime()]}
  `(
    'getUniqueSortedTimestamps($timestamps) with onlyFuture:$onlyFuture option returns $uniqueSortedTimestamps',
    ({ timestamps, onlyFuture, uniqueSortedTimestamps }) => {
      expect(getUniqueSortedTimestamps(timestamps, onlyFuture)).toEqual(uniqueSortedTimestamps)
    }
  )
})
