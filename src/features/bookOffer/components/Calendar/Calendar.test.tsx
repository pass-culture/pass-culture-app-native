import { OfferStatus } from 'features/bookOffer/helpers/utils'

import { getDayDescription, getMinAvailableDate } from './Calendar'
import { Marking } from './useMarkedDates'

const marking = { price: 2700, selected: false, status: OfferStatus.BOOKABLE }

describe('getMinAvailableDate', () => {
  it.each`
    dates                                         | expected
    ${[]}                                         | ${undefined}
    ${['2021-03-28']}                             | ${'2021-03-28'}
    ${['2021-03-28', '2021-03-29']}               | ${'2021-03-28'}
    ${['2021-03-29', '2021-03-28']}               | ${'2021-03-28'}
    ${['2021-03-29', '2021-02-12', '2021-03-28']} | ${'2021-02-12'}
  `(
    'should return the first date from a set of available dates: $dates \t= $expected',
    ({ dates, expected }: { dates: string[]; expected: string | undefined }) => {
      const markedDates = dates.reduce((acc: Record<string, Marking>, curr) => {
        acc[curr] = marking
        return acc
      }, {})

      expect(getMinAvailableDate(markedDates)).toBe(expected)
    }
  )

  it('should return the first available date', () => {
    const minDate = getMinAvailableDate({
      '2021-03-28': marking,
      '2021-03-27': { ...marking, status: OfferStatus.NOT_BOOKABLE },
    })

    expect(minDate).toEqual('2021-03-28')
  })
})

describe('getDayDescription', () => {
  describe('when price = 20', () => {
    it('should return 20\u00a0€ when has not several prices', () => {
      const dayDescription = getDayDescription(2000)

      expect(dayDescription).toEqual('20\u00a0€')
    })

    it('should return dès 20\u00a0€ when has several prices', () => {
      const dayDescription = getDayDescription(2000, true)

      expect(dayDescription).toEqual('dès 20\u00a0€')
    })
  })
})
