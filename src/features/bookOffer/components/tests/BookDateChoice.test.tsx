import mockdate from 'mockdate'

import { OfferStockResponse } from 'api/gen'
import {
  notExpiredStock,
  soldOutStock,
  expiredStock2,
} from 'features/offer/services/useCtaWordingAndAction.testsFixtures'

import { getStocksByDate, getDateStatusAndPrice, OfferStatus } from '../BookDateChoice'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

describe('getStocksByDate()', () => {
  it.each`
    stocks | expected
    ${[notExpiredStock]} | ${{ ['01/01/2021']: [{
      id: 118929,
      beginningDatetime: new Date('2021-01-01T13:30:00'),
      bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
      price: 500,
      isBookable: true,
    }] }}
    ${[soldOutStock, notExpiredStock, expiredStock2]} | ${{ ['01/01/2021']: [{
      id: 118929,
      beginningDatetime: new Date('2021-01-01T13:30:00'),
      bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
      price: 500,
      isBookable: false,
    }, {
      id: 118929,
      beginningDatetime: new Date('2021-01-01T13:30:00'),
      bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
      price: 500,
      isBookable: true,
    }], ['02/01/2021']: [{
      id: 118928,
      beginningDatetime: new Date('2021-01-02T18:00:00'),
      bookingLimitDatetime: new Date('2021-01-03T13:30:00'),
      price: 500,
      isBookable: true,
    }] }}
  `(
    'should return $stocks by date',
    ({ stocks, expected }: { stocks: OfferStockResponse[]; expected: Date[] }) => {
      expect(getStocksByDate(stocks)).toEqual(expected)
    }
  )
})

describe('getDateStatusAndPrice()', () => {
  it.each`
    date | stocksDate | expected
    ${new Date('2021-01-01T13:30:00')} | ${{ ['01/01/2021']: [{
      id: 118929,
      beginningDatetime: new Date('2021-01-01T13:30:00'),
      bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
      price: 500,
      isBookable: false,
    }, {
      id: 118929,
      beginningDatetime: new Date('2021-01-01T13:30:00'),
      bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
      price: 500,
      isBookable: true,
    }] }} | ${{ status: OfferStatus.BOOKABLE }}
    ${new Date('2021-01-01T13:30:00')} | ${{ ['01/01/2021']: [{
      id: 118929,
      beginningDatetime: new Date('2021-01-01T13:30:00'),
      bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
      price: 500,
      isBookable: false,
    }] }} | ${{ status: OfferStatus.NOTBOOKABLE }}
    ${new Date('2021-02-01T13:30:00')} | ${{ ['01/01/2021']: [{
      id: 118929,
      beginningDatetime: new Date('2021-01-01T13:30:00'),
      bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
      price: 500,
      isBookable: false,
    }] }} | ${{ status: OfferStatus.NOTOFFERED }}
  `(
    'should return status of $date',
    ({
      date,
      stocksDate,
      expected,
    }: {
      date: Date
      stocksDate: { [date: string]: OfferStockResponse[] }
      expected: { status: OfferStatus }
    }) => {
      expect(getDateStatusAndPrice(date, stocksDate)).toEqual(expected)
    }
  )
})
