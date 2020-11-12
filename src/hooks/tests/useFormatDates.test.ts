import { getDisplayDates } from '../useFormatDates'

describe('useFormatDates', () => {
  it.each`
    dates                        | expected
    ${undefined}                 | ${undefined}
    ${[]}                        | ${undefined}
    ${[1605205600]}              | ${'12 nov 2020'}
    ${[1605205600, 1605205600]}  | ${'12 nov 2020'}
    ${[1607205600]}              | ${'5 déc 2020'}
    ${[1607205600, 1605205600]}  | ${'Dès le 12 nov 2020'}
    ${[1607205600, -1605205600]} | ${'5 déc 2020'}
  `('getDisplayDates($dates) \t= $expected', ({ dates, expected }) => {
    expect(getDisplayDates(dates)).toBe(expected)
  })
})
