import mockdate from 'mockdate'

import { formatDates } from '../formatDates'

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
    ${[Nov12]}        | ${'12 nov 2020'}
    ${[Nov12, Nov12]} | ${'12 nov 2020'}
    ${[Dec5]}         | ${'5 déc 2020'}
    ${[Dec5, Nov12]}  | ${'Dès le 12 nov 2020'}
    ${[Dec5, -Nov12]} | ${'5 déc 2020'}
    ${[Oct5, Oct5]}   | ${undefined}
    ${[Oct5, Nov12]}  | ${'12 nov 2020'}
  `('formatDates($dates) \t= $expected', ({ dates, expected }) => {
    const timestampsInSeconds =
      dates && dates.map((date: Date) => Math.floor(date.valueOf() / 1000))
    expect(formatDates(timestampsInSeconds)).toBe(expected)
  })
})
