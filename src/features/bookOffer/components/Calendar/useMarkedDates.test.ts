import mockdate from 'mockdate'

import { useMarkedDates } from 'features/bookOffer/components/Calendar/useMarkedDates'
import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { offerStockResponseSnap } from 'features/offer/fixtures/offerStockResponse'
import { renderHook } from 'tests/utils'

const mockBookingState: BookingState = {
  offerId: undefined,
  stockId: undefined,
  step: Step.DATE,
  quantity: 1,
  date: new Date(2021, 0, 1),
}

jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: jest.fn(() => ({ bookingState: mockBookingState })),
}))

mockdate.set(new Date('2020-12-01T00:00:00Z'))

const credit = 1000

describe('useMarkedDates()', () => {
  it('should not mark any dates if there are no stocks', () => {
    const { result } = renderHook(() => useMarkedDates([], 10))
    expect(result.current).toStrictEqual({})
  })

  it('should mark selected date correctly', () => {
    let hook = renderHook(() => useMarkedDates([offerStockResponseSnap], credit))
    expect(hook.result.current['2021-01-01'].selected).toBeTruthy()

    mockBookingState.date = new Date(2021, 4, 4)
    hook = renderHook(() => useMarkedDates([offerStockResponseSnap], credit))
    expect(hook.result.current['2021-01-01'].selected).toBeFalsy()
  })

  it('should skip stocks without date', () => {
    const stock = { ...offerStockResponseSnap, beginningDatetime: undefined }
    const { result } = renderHook(() => useMarkedDates([stock], credit))
    expect(result.current).toStrictEqual({})
  })

  it('should select the bookable stock for a particular date', () => {
    const stocks = [
      { ...offerStockResponseSnap, isBookable: false, price: 200 },
      { ...offerStockResponseSnap, isBookable: true, price: 2000 },
    ]
    const { result } = renderHook(() => useMarkedDates(stocks, 2000))
    expect(result.current['2021-01-01'].price).toEqual(2000)
    expect(result.current['2021-01-01'].status).toEqual('BOOKABLE')
  })

  it('should return the correct status and price for non bookable stocks', () => {
    const stocks = [
      { ...offerStockResponseSnap, isBookable: false, price: 200 },
      { ...offerStockResponseSnap, isBookable: false, price: 2000 },
    ]
    const { result } = renderHook(() => useMarkedDates(stocks, 2000))
    expect(result.current['2021-01-01'].price).toEqual(200)
    expect(result.current['2021-01-01'].status).toEqual('NOT_BOOKABLE')
  })

  it('should select the bookable stock for a particular date even if not enough credit', () => {
    const stocks = [
      { ...offerStockResponseSnap, isBookable: false, price: 200 },
      { ...offerStockResponseSnap, isBookable: true, price: 2000 },
    ]
    const { result } = renderHook(() => useMarkedDates(stocks, 200))
    expect(result.current['2021-01-01'].price).toEqual(2000)
    expect(result.current['2021-01-01'].status).toEqual('NOT_BOOKABLE')
  })
})
