import { getMinDate } from '../Calendar/Calendar'

describe('getMinDate', () => {
  it.each`
    dates                                         | expected
    ${[]}                                         | ${undefined}
    ${['2021-03-28']}                             | ${'2021-03-28'}
    ${['2021-03-28', '2021-03-29']}               | ${'2021-03-28'}
    ${['2021-03-29', '2021-03-28']}               | ${'2021-03-28'}
    ${['2021-03-29', '2021-02-12', '2021-03-28']} | ${'2021-02-12'}
  `('getMinDate($dates) \t= $expected', ({ dates, expected }) => {
    expect(getMinDate(dates)).toBe(expected)
  })
})
