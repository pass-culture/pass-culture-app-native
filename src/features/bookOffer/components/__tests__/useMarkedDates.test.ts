import { renderHook } from '@testing-library/react-hooks'
import mockdate from 'mockdate'

import { useMarkedDates } from 'features/bookOffer/components/Calendar/useMarkedDates'
import { BookingState, Step } from 'features/bookOffer/pages/reducer'
import { notExpiredStock } from 'features/offer/services/useCtaWordingAndAction.testsFixtures'

const mockBookingState: BookingState = {
  offerId: undefined,
  stockId: undefined,
  step: Step.DATE,
  quantity: 1,
  date: new Date(2021, 0, 1),
}

jest.mock('features/bookOffer/pages/BookingOfferWrapper', () => ({
  useBooking: jest.fn(() => ({ bookingState: mockBookingState })),
}))

mockdate.set(new Date('2020-12-01T00:00:00Z'))

const credit = 1000

describe('useMarkedDates()', () => {
  it('should not mark any dates if there are no stocks', () => {
    const { result } = renderHook(() => useMarkedDates([], 10))
    expect(result.current).toStrictEqual({})
  })

  it('should mark selected date correctly', () => {
    let hook = renderHook(() => useMarkedDates([notExpiredStock], credit))
    expect(hook.result.current['2021-01-01'].selected).toBeTruthy()

    mockBookingState.date = new Date(2021, 4, 4)
    hook = renderHook(() => useMarkedDates([notExpiredStock], credit))
    expect(hook.result.current['2021-01-01'].selected).toBeFalsy()
  })

  it('should skip stocks without date', () => {
    const stock = { ...notExpiredStock, beginningDatetime: null }
    const { result } = renderHook(() => useMarkedDates([stock], credit))
    expect(result.current).toStrictEqual({})
  })

  it('should select the bookable stock for a particular date', () => {
    const stocks = [
      { ...notExpiredStock, isBookable: false, price: 200 },
      { ...notExpiredStock, isBookable: true, price: 2000 },
    ]
    const { result } = renderHook(() => useMarkedDates(stocks, 2000))
    expect(result.current['2021-01-01'].price).toEqual(2000)
    expect(result.current['2021-01-01'].status).toEqual('BOOKABLE')
  })

  it('should return the correct status and price for non bookable stocks', () => {
    const stocks = [
      { ...notExpiredStock, isBookable: false, price: 200 },
      { ...notExpiredStock, isBookable: false, price: 2000 },
    ]
    const { result } = renderHook(() => useMarkedDates(stocks, 2000))
    expect(result.current['2021-01-01'].price).toEqual(200)
    expect(result.current['2021-01-01'].status).toEqual('NOT_BOOKABLE')
  })

  it('should select the bookable stock for a particular date even if not enough credit', () => {
    const stocks = [
      { ...notExpiredStock, isBookable: false, price: 200 },
      { ...notExpiredStock, isBookable: true, price: 2000 },
    ]
    const { result } = renderHook(() => useMarkedDates(stocks, 200))
    expect(result.current['2021-01-01'].price).toEqual(2000)
    expect(result.current['2021-01-01'].status).toEqual('NOT_BOOKABLE')
  })
})
