import mockdate from 'mockdate'

import {
  notExpiredStock,
  soldOutStock,
  expiredStock2,
} from 'features/offer/services/useCtaWordingAndAction.testsFixtures'

import { getStocksByDate, getDateStatusAndPrice, OfferStatus } from '../../services/utils'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

describe('getStocksByDate()', () => {
  it('returns correctly stocks for one date : ', () => {
    const stocksWithOneDate = [notExpiredStock]

    const expectedStockForOneDate = {
      ['01/01/2021']: [
        {
          id: 118929,
          beginningDatetime: new Date('2021-01-01T13:30:00'),
          bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
          price: 500,
          isBookable: true,
        },
      ],
    }

    expect(getStocksByDate(stocksWithOneDate)).toStrictEqual(expectedStockForOneDate)
  })

  it('returns correctly stocks for multiple dates : ', () => {
    const stocksWithDifferentDates = [soldOutStock, notExpiredStock, expiredStock2]

    const expectedStockForMultipleDates = {
      ['01/01/2021']: [
        {
          id: 118929,
          beginningDatetime: new Date('2021-01-01T13:30:00'),
          bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
          price: 500,
          isBookable: false,
        },
        {
          id: 118929,
          beginningDatetime: new Date('2021-01-01T13:30:00'),
          bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
          price: 500,
          isBookable: true,
        },
      ],
      ['02/01/2021']: [
        {
          id: 118928,
          beginningDatetime: new Date('2021-01-02T18:00:00'),
          bookingLimitDatetime: new Date('2021-01-03T13:30:00'),
          price: 500,
          isBookable: true,
        },
      ],
    }
    expect(getStocksByDate(stocksWithDifferentDates)).toStrictEqual(expectedStockForMultipleDates)
  })
})

describe('getDateStatusAndPrice()', () => {
  it('returns not offered status if date is not in stocksByDate', () => {
    const dateNotInStocks = new Date('2021-02-01T13:30:00')
    const stocksByDate = {
      ['01/01/2021']: [
        {
          id: 118929,
          beginningDatetime: new Date('2021-01-01T13:30:00'),
          bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
          price: 500,
          isBookable: false,
        },
      ],
    }

    expect(getDateStatusAndPrice(dateNotInStocks, stocksByDate)).toStrictEqual({
      status: OfferStatus.NOT_OFFERED,
      price: null,
    })
  })

  it('returns bookable status if at least 1 stock is bookable', () => {
    const dateInStocks = new Date('2021-01-01T13:30:00')
    const stocksByDate = {
      ['01/01/2021']: [
        {
          id: 118929,
          beginningDatetime: new Date('2021-01-01T13:30:00'),
          bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
          price: 500,
          isBookable: false,
        },
        {
          id: 118929,
          beginningDatetime: new Date('2021-01-01T13:30:00'),
          bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
          price: 450,
          isBookable: true,
        },
      ],
    }

    expect(getDateStatusAndPrice(dateInStocks, stocksByDate)).toStrictEqual({
      status: OfferStatus.BOOKABLE,
      price: '4,50€',
    })
  })
  it('returns not bookable status if date is in stocks and all stocks are not bookable', () => {
    const dateInStocks = new Date('2021-01-01T13:30:00')
    const stocksByDate = {
      ['01/01/2021']: [
        {
          id: 118929,
          beginningDatetime: new Date('2021-01-01T13:30:00'),
          bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
          price: 500,
          isBookable: false,
        },
        {
          id: 118929,
          beginningDatetime: new Date('2021-01-01T13:30:00'),
          bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
          price: 0,
          isBookable: false,
        },
      ],
    }
    expect(getDateStatusAndPrice(dateInStocks, stocksByDate)).toStrictEqual({
      status: OfferStatus.NOT_BOOKABLE,
      price: '0€',
    })
  })
})
