import mockdate from 'mockdate'

import { OfferStockResponse } from 'api/gen'
import {
  formatHour,
  formatToKeyDate,
  getDatePrice,
  getStatusFromStockAndCredit,
  OfferStatus,
} from 'features/bookOffer/services/utils'
import {
  notExpiredStock,
  soldOutStock,
  expiredStock2,
} from 'features/offer/services/useCtaWordingAndAction.testsFixtures'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

describe('formatToKeyDate()', () => {
  it.each`
    date                            | expected
    ${new Date(2020, 6, 6)}         | ${'2020-07-06'}
    ${new Date(2020, 11, 31)}       | ${'2020-12-31'}
    ${new Date(2020, 11, 1)}        | ${'2020-12-01'}
    ${new Date(2020, 11, 1, 9, 30)} | ${'2020-12-01'}
  `(
    'should format Date $date to string "$expected"',
    ({ date, expected }: { date: Date; expected: string }) => {
      expect(formatToKeyDate(date)).toEqual(expected)
    }
  )
})

describe('formatHour()', () => {
  it.each`
    date                            | expected
    ${undefined}                    | ${''}
    ${null}                         | ${''}
    ${new Date(2020, 1, 1, 9, 2)}   | ${'9:02'}
    ${new Date(2020, 1, 1, 9, 20)}  | ${'9:20'}
    ${new Date(2020, 1, 1, 19, 2)}  | ${'19:02'}
    ${new Date(2020, 1, 1, 19, 20)} | ${'19:20'}
    ${'2021-03-09T09:17:59.760Z'}   | ${'9:17'}
  `(
    'should format Date $date to string "$expected"',
    ({ date, expected }: { date: Date; expected: string }) => {
      expect(formatHour(date)).toEqual(expected)
    }
  )
})

describe('getStatusFromStockAndCredit()', () => {
  it.each`
    stock              | credit  | expected
    ${notExpiredStock} | ${null} | ${OfferStatus.NOT_BOOKABLE}
    ${soldOutStock}    | ${null} | ${OfferStatus.NOT_BOOKABLE}
    ${expiredStock2}   | ${null} | ${OfferStatus.NOT_BOOKABLE}
    ${notExpiredStock} | ${0}    | ${OfferStatus.NOT_BOOKABLE}
    ${soldOutStock}    | ${0}    | ${OfferStatus.NOT_BOOKABLE}
    ${expiredStock2}   | ${0}    | ${OfferStatus.NOT_BOOKABLE}
    ${notExpiredStock} | ${1000} | ${OfferStatus.BOOKABLE}
    ${soldOutStock}    | ${1000} | ${OfferStatus.NOT_BOOKABLE}
    ${expiredStock2}   | ${1000} | ${OfferStatus.NOT_BOOKABLE}
  `(
    'should get status "$expected" from stock and credit',
    ({
      stock,
      credit,
      expected,
    }: {
      stock: OfferStockResponse
      credit: number | null
      expected: OfferStatus
    }) => {
      expect(getStatusFromStockAndCredit(stock, credit)).toEqual(expected)
    }
  )
})

describe('getDatePrice()', () => {
  it.each`
    stock                                | previousPrice | expected
    ${notExpiredStock}                   | ${null}       | ${500}
    ${soldOutStock}                      | ${null}       | ${500}
    ${expiredStock2}                     | ${null}       | ${500}
    ${notExpiredStock}                   | ${0}          | ${0}
    ${soldOutStock}                      | ${0}          | ${0}
    ${expiredStock2}                     | ${0}          | ${0}
    ${notExpiredStock}                   | ${1000}       | ${500}
    ${soldOutStock}                      | ${1000}       | ${500}
    ${expiredStock2}                     | ${1000}       | ${500}
    ${{ ...expiredStock2, price: null }} | ${null}       | ${null}
    ${{ ...expiredStock2, price: null }} | ${1000}       | ${1000}
  `(
    'should get date price "$expected" from stock and previous price for the date',
    ({
      stock,
      previousPrice,
      expected,
    }: {
      stock: OfferStockResponse
      previousPrice: number | null
      expected: number | null
    }) => {
      expect(getDatePrice(previousPrice, stock)).toEqual(expected)
    }
  )
})
