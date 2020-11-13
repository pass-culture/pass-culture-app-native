import mockdate from 'mockdate'

import { formatDates } from '../formatDates'

describe('formatDates', () => {
  beforeAll(() => {
    // 1 nov 2020
    mockdate.set(new Date(2020, 10, 1, 10, 0, 0))
  })

  it.each`
    dates                        | expected
    ${undefined}                 | ${undefined}
    ${[]}                        | ${undefined}
    ${[1605205600]}              | ${'12 nov 2020'}
    ${[1605205600, 1605205600]}  | ${'12 nov 2020'}
    ${[1607205600]}              | ${'5 déc 2020'}
    ${[1607205600, 1605205600]}  | ${'Dès le 12 nov 2020'}
    ${[1607205600, -1605205600]} | ${'5 déc 2020'}
    ${[1600205600, 1600205600]}  | ${undefined}
    ${[1600205600, 1605205600]}  | ${'12 nov 2020'}
  `('formatDates($dates) \t= $expected', ({ dates, expected }) => {
    expect(formatDates(dates)).toBe(expected)
  })
})
