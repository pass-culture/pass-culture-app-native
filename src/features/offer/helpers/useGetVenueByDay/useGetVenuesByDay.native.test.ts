import { addDays } from 'date-fns'
import mockdate from 'mockdate'

import * as getStocksByOfferIdsModule from 'features/offer/api/getStocksByOfferIds'
import { useGetVenuesByDay } from 'features/offer/helpers/useGetVenueByDay/useGetVenuesByDay'
import { LocationMode, Position } from 'libs/location/types'
import { dateBuilder, mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

const TODAY = dateBuilder().withDay(2).withHours(6)
const TODAY_LATER = dateBuilder().withDay(2).withHours(10)
const TODAY_DATE = TODAY.toDate()
const AFTER_15_DAYS = addDays(TODAY.toDate(), 16)

const TODAY_STOCK = mockBuilder.offerStockResponse({
  beginningDatetime: TODAY_LATER.toString(),
})

const STOCK_AFTER_15_DAYS = mockBuilder.offerStockResponse({
  beginningDatetime: AFTER_15_DAYS.toString(),
})

const OFFER_WITH_STOCKS_TODAY = mockBuilder.offerResponseV2({
  stocks: [TODAY_STOCK],
})

const OFFER_WITH_STOCKS_AFTER_15_DAYS = mockBuilder.offerResponseV2({
  stocks: [STOCK_AFTER_15_DAYS],
})

const OFFER_WITHOUT_STOCKS = mockBuilder.offerResponseV2({
  stocks: [],
})

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/network/NetInfoWrapper')

const mockLocationMode = LocationMode.AROUND_ME
const mockUserLocation: Position = { latitude: 48.90374, longitude: 2.48171 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockUserLocation,
    selectedLocationMode: mockLocationMode,
  }),
}))

const mockedGetStocksByOfferIds = jest.spyOn(getStocksByOfferIdsModule, 'getStocksByOfferIds')

mockdate.set(TODAY.toDate())

describe('useGetVenuesByDay', () => {
  describe('hasStocksOnlyAfter15Days', () => {
    it('should be true when there is only stocks after 15 days', async () => {
      const offers = [OFFER_WITHOUT_STOCKS, OFFER_WITH_STOCKS_AFTER_15_DAYS]
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = renderUseGetVenueByDay(TODAY_DATE, offers)

      await act(async () => {})

      expect(result.current.hasStocksOnlyAfter15Days).toBe(true)
    })

    it('should be false when there is stocks within 15 days', async () => {
      const offers = [OFFER_WITH_STOCKS_TODAY, OFFER_WITHOUT_STOCKS]
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = renderUseGetVenueByDay(TODAY_DATE, offers)

      await act(async () => {})

      expect(result.current.hasStocksOnlyAfter15Days).toBe(false)
    })
  })

  it('should return an empty list when the offer is not available in any cinema', async () => {
    const { result } = renderUseGetVenueByDay(TODAY_DATE, [])

    await act(() => {})

    expect(result.current.movieOffers).toStrictEqual([])
  })

  it('should return all the results of the indicated venue and cinema today', async () => {
    const initialNumberOfCinema = 5
    const offers = generateOfferNumber(initialNumberOfCinema, OFFER_WITH_STOCKS_TODAY)

    const { result } = renderUseGetVenueByDay(TODAY_DATE, offers)

    await act(async () => {})

    expect(result.current.movieOffers).toHaveLength(initialNumberOfCinema)
  })

  it('should only return cinemas having stocks', async () => {
    const offers = [
      OFFER_WITH_STOCKS_TODAY,
      OFFER_WITH_STOCKS_AFTER_15_DAYS,
      OFFER_WITH_STOCKS_AFTER_15_DAYS,
      OFFER_WITHOUT_STOCKS,
    ]

    const { result } = renderUseGetVenueByDay(TODAY_DATE, offers)

    await act(async () => {})

    expect(result.current.movieOffers).toHaveLength(3)
  })
})

const renderUseGetVenueByDay = (...params: Parameters<typeof useGetVenuesByDay>) =>
  renderHook(({ date }: { date: Date }) => useGetVenuesByDay(date, params[1]), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
    initialProps: { date: params[0] },
  })

function generateOfferNumber<T>(length: number, element: T): T[] {
  return new Array(length).fill(element)
}
