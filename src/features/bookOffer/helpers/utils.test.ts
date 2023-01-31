import mockdate from 'mockdate'

import {
  formatHour,
  formatToKeyDate,
  getStatusFromStocks,
  OfferStatus,
} from 'features/bookOffer/helpers/utils'
import { offerStockResponseSnap } from 'features/offer/fixtures/offerStockResponse'

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
    ({ date, expected }: { date: string; expected: string }) => {
      expect(formatHour(date)).toEqual(expected)
    }
  )
})

describe('getStatusFromStocks()', () => {
  it('should return NOT_BOOKABLE if no stock', () => {
    const status = getStatusFromStocks([], 1000)
    expect(status).toEqual(OfferStatus.NOT_BOOKABLE)
  })
  it('should return NOT_BOOKABLE if no bookable stock', () => {
    const status = getStatusFromStocks(
      [
        { ...offerStockResponseSnap, isBookable: false, price: 200 },
        { ...offerStockResponseSnap, isBookable: false, price: 2000 },
      ],
      1000
    )
    expect(status).toEqual(OfferStatus.NOT_BOOKABLE)
  })
  it('should return NOT_BOOKABLE if the bookable stocks are too expensive', () => {
    const status = getStatusFromStocks(
      [
        { ...offerStockResponseSnap, isBookable: false, price: 200 },
        { ...offerStockResponseSnap, isBookable: true, price: 2000 },
      ],
      1000
    )
    expect(status).toEqual(OfferStatus.NOT_BOOKABLE)
  })
  it('should return BOOKABLE if one bookable stock is under the user credit', () => {
    const status = getStatusFromStocks(
      [
        { ...offerStockResponseSnap, isBookable: false, price: 200 },
        { ...offerStockResponseSnap, isBookable: true, price: 2000 },
        { ...offerStockResponseSnap, isBookable: true, price: 4000 },
      ],
      2000
    )
    expect(status).toEqual(OfferStatus.BOOKABLE)
  })
})
