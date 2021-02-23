import mockdate from 'mockdate'

import { OfferStockResponse } from 'api/gen'
import {
  notExpiredStock,
  soldOutStock,
  expiredStock2,
} from 'features/offer/services/useCtaWordingAndAction.testsFixtures'

import { getDatesByStatus } from '../BookDateChoice'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

describe('getDatesByStatus()', () => {
  it.each`
    stocks                                            | expected
    ${[notExpiredStock]}                              | ${[new Date('2021-01-01T13:30:00')]}
    ${[soldOutStock]}                                 | ${[]}
    ${[soldOutStock, notExpiredStock, expiredStock2]} | ${[new Date('2021-01-01T13:30:00')]}
  `(
    'should return bookable Dates from $stocks',
    ({ stocks, expected }: { stocks: OfferStockResponse[]; expected: Date[] }) => {
      expect(getDatesByStatus(stocks).bookableDates).toEqual(expected)
    }
  )
})
