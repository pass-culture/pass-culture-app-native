import { addDays } from 'date-fns'
import mockdate from 'mockdate'

import * as getStocksByOfferIdsModule from 'features/offer/api/getStocksByOfferIds'
import { useGetVenuesByDay } from 'features/offer/helpers/useGetVenueByDay/useGetVenuesByDay'
import * as fetchAlgoliaOffer from 'libs/algolia/fetchAlgolia/fetchOffers'
import { LocationMode, Position } from 'libs/location/types'
import { dateBuilder, mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

const TODAY = dateBuilder().withDay(2).withHours(6)
const TODAY_LATER = dateBuilder().withDay(2).withHours(10)
const TODAY_DATE = TODAY.toDate()
const AFTER_15_DAYS = addDays(TODAY.toDate(), 16)
const TOMORROW = dateBuilder().withDay(3)

const TODAY_STOCK = mockBuilder.offerStockResponse({
  beginningDatetime: TODAY_LATER.toString(),
})

const TOMORROW_STOCK = mockBuilder.offerStockResponse({
  beginningDatetime: TOMORROW.toString(),
})

const STOCK_AFTER_15_DAYS = mockBuilder.offerStockResponse({
  beginningDatetime: AFTER_15_DAYS.toString(),
})

const OFFER_WITH_STOCKS_TODAY = mockBuilder.offerResponseV2({
  stocks: [TODAY_STOCK],
})

const OFFER_WITH_STOCKS_TOMORROW = mockBuilder.offerResponseV2({
  stocks: [TOMORROW_STOCK],
})

const OFFER_WITH_STOCKS_AFTER_15_DAYS = mockBuilder.offerResponseV2({
  stocks: [STOCK_AFTER_15_DAYS],
})

const OFFER_WITHOUT_STOCKS = mockBuilder.offerResponseV2({
  stocks: [],
})

const OFFER_WITHOUT_ALLOCINE_ID = mockBuilder.offerResponseV2({ extraData: { allocineId: null } })

mockdate.set(TODAY_DATE)

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
const fetchOffersSpy = jest.spyOn(fetchAlgoliaOffer, 'fetchOffers')

describe('useGetVenueByDay', () => {
  describe('items', () => {
    it('should call fetchOffers with allocineId when provided', async () => {
      renderUseGetVenueByDay(TODAY_DATE, OFFER_WITH_STOCKS_TODAY)

      const allocineId = OFFER_WITH_STOCKS_TODAY.extraData?.allocineId

      await act(() => {})

      expect(fetchOffersSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          parameters: expect.objectContaining({ allocineId }),
        })
      )
    })

    it('should call fetchOffers with offerId when no allocineId is provided', async () => {
      renderUseGetVenueByDay(TODAY_DATE, OFFER_WITHOUT_ALLOCINE_ID)

      const offerId = OFFER_WITHOUT_ALLOCINE_ID.id.toString()

      await act(() => {})

      expect(fetchOffersSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          parameters: expect.objectContaining({ objectIds: [offerId] }),
        })
      )
    })

    it('should return an empty list when the offer is not available in any cinema', async () => {
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers: [] })

      const { result } = renderUseGetVenueByDay(TODAY_DATE, mockBuilder.offerResponseV2({}))

      await act(() => {})

      expect(result.current.items).toStrictEqual([])
    })

    it('should return all the results of the indicated venue and cinema today', async () => {
      const initialNumberOfCinema = 5
      const offers = generateOfferNumber(initialNumberOfCinema, OFFER_WITH_STOCKS_TODAY)
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = await renderUseGetVenueByDay(TODAY_DATE, mockBuilder.offerResponseV2({}))

      await act(async () => {})

      expect(result.current.items).toHaveLength(initialNumberOfCinema)
    })

    it('should only return cinemas having stocks', async () => {
      const offers = [
        OFFER_WITH_STOCKS_TODAY,
        OFFER_WITH_STOCKS_AFTER_15_DAYS,
        OFFER_WITH_STOCKS_AFTER_15_DAYS,
        OFFER_WITHOUT_STOCKS,
      ]
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = renderUseGetVenueByDay(TODAY_DATE, mockBuilder.offerResponseV2({}))

      await act(async () => {})

      expect(result.current.items).toHaveLength(3)
    })

    it('should return the specified initial number of cinema', async () => {
      const initialNumberOfCinema = 7
      const offers = generateOfferNumber(10, OFFER_WITH_STOCKS_TODAY)

      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = await renderUseGetVenueByDay(TODAY_DATE, mockBuilder.offerResponseV2({}), {
        initialCount: initialNumberOfCinema,
      })

      await act(async () => {})

      expect(result.current.items).toHaveLength(initialNumberOfCinema)
    })
  })

  describe('getNext', () => {
    it('should return the number of more specified cinema', async () => {
      const offers = generateOfferNumber(10, OFFER_WITH_STOCKS_TODAY)
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = await renderUseGetVenueByDay(TODAY_DATE, mockBuilder.offerResponseV2({}), {
        initialCount: 6,
        nextCount: 3,
      })

      await act(async () => {
        result.current.increaseCount()
      })

      expect(result.current.items).toHaveLength(9)
    })
  })

  describe('isEnd', () => {
    it('should be false if there are remaining items not displayed', async () => {
      const offers = generateOfferNumber(10, OFFER_WITH_STOCKS_TODAY)
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = await renderUseGetVenueByDay(TODAY_DATE, mockBuilder.offerResponseV2({}), {
        initialCount: 6,
      })

      await act(async () => {})

      expect(result.current.isEnd).toBeFalsy()
    })

    it('should be true if all items are already displayed', async () => {
      const offers = generateOfferNumber(3, OFFER_WITH_STOCKS_TODAY)
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = await renderUseGetVenueByDay(TODAY_DATE, mockBuilder.offerResponseV2({}), {
        initialCount: 6,
      })

      await act(async () => {})

      expect(result.current.isEnd).toBeTruthy()
    })

    it('should be true if items are displayed after a increaseCount', async () => {
      const offers = generateOfferNumber(8, OFFER_WITH_STOCKS_TODAY)
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = await renderUseGetVenueByDay(TODAY_DATE, mockBuilder.offerResponseV2({}), {
        initialCount: 6,
        nextCount: 3,
      })

      await act(async () => {
        result.current.increaseCount()
      })

      expect(result.current.isEnd).toBeTruthy()
    })
  })

  describe('change date', () => {
    it('should return the list of cinema for a specified date', async () => {
      const tomorrowOffers = generateOfferNumber(2, OFFER_WITH_STOCKS_TOMORROW)

      mockedGetStocksByOfferIds.mockResolvedValueOnce({
        offers: tomorrowOffers,
      })

      const offer = mockBuilder.offerResponseV2({})
      const options = {
        initialCount: 6,
        nextCount: 3,
      }

      const { result, rerender } = await renderUseGetVenueByDay(TODAY_DATE, offer, options)

      expect(result.current.items).toHaveLength(0)

      await act(async () => {
        rerender({ date: dateBuilder().withDay(4).toDate() })
      })

      expect(result.current.items).toHaveLength(2)
    })

    it('should return the initial number of cinema after using increaseCount', async () => {
      const todaysOffers = generateOfferNumber(10, OFFER_WITH_STOCKS_TODAY)
      const tomorrowOffers = generateOfferNumber(10, OFFER_WITH_STOCKS_TOMORROW)

      mockedGetStocksByOfferIds.mockResolvedValueOnce({
        offers: [...todaysOffers, ...tomorrowOffers],
      })

      const offer = mockBuilder.offerResponseV2({})
      const options = {
        initialCount: 6,
        nextCount: 3,
      }

      const { result, rerender } = await renderUseGetVenueByDay(TODAY_DATE, offer, options)

      await act(async () => {
        result.current.increaseCount()
      })
      await act(async () => {
        rerender({ date: TOMORROW.toDate() })
      })

      await act(async () => {
        rerender({ date: TODAY.toDate() })
      })

      expect(result.current.items).toHaveLength(6)
    })
  })

  describe('isLoading', () => {
    it('should be true when fetching data', async () => {
      mockedGetStocksByOfferIds.mockReturnValueOnce(new Promise(jest.fn())) // Never resolving promise to simulate loading

      const { result } = renderUseGetVenueByDay(TODAY_DATE, mockBuilder.offerResponseV2({}))

      await act(async () => {})

      expect(result.current.isLoading).toBe(true)
    })

    it('should be false when data is loaded', async () => {
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers: [] })

      const { result } = renderUseGetVenueByDay(TODAY_DATE, mockBuilder.offerResponseV2({}))

      await act(async () => {})

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('hasStocksOnlyAfter15Days', () => {
    it('should be true when there is only stocks after 15 days', async () => {
      const offers = [OFFER_WITHOUT_STOCKS, OFFER_WITH_STOCKS_AFTER_15_DAYS]
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = renderUseGetVenueByDay(TODAY_DATE, mockBuilder.offerResponseV2({}))

      await act(async () => {})

      expect(result.current.hasStocksOnlyAfter15Days).toBe(true)
    })

    it('should be false when there is stocks within 15 days', async () => {
      const offers = [OFFER_WITH_STOCKS_TODAY, OFFER_WITHOUT_STOCKS]
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = renderUseGetVenueByDay(TODAY_DATE, mockBuilder.offerResponseV2({}))

      await act(async () => {})

      expect(result.current.hasStocksOnlyAfter15Days).toBe(false)
    })
  })
})

const renderUseGetVenueByDay = (...params: Parameters<typeof useGetVenuesByDay>) =>
  renderHook(({ date }) => useGetVenuesByDay(date, params[1], params[2]), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
    initialProps: { date: params[0] },
  })

function generateOfferNumber<T>(length: number, element: T): T[] {
  return new Array(length).fill(element)
}
