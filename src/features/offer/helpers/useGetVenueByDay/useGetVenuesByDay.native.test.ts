import mockdate from 'mockdate'

import * as getStocksByOfferIdsModule from 'features/offer/api/getStocksByOfferIds'
import {
  dateBuilder,
  offerResponseBuilder,
  stockBuilder,
} from 'features/offer/components/MoviesScreeningCalendar/offersStockResponse.builder'
import { useGetVenuesByDay } from 'features/offer/helpers/useGetVenueByDay/useGetVenuesByDay'
import { LocationMode, Position } from 'libs/location/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

const TODAY = dateBuilder().withDay(2).withHours(6)
const TODAY_LATER = dateBuilder().withDay(2).withHours(10)
const TODAY_DATE = TODAY.toDate()
const TOMORROW = dateBuilder().withDay(3)

const TODAY_STOCK = stockBuilder().withBeginningDatetime(TODAY_LATER.toString())
const TOMORROW_STOCK = stockBuilder().withBeginningDatetime(TOMORROW.toString())

const OFFER_WITH_STOCKS_TODAY = offerResponseBuilder().withStocks([TODAY_STOCK.build()]).build()
const OFFER_WITH_STOCKS_TOMORROW = offerResponseBuilder()
  .withStocks([TOMORROW_STOCK.build()])
  .build()

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

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

const mockedGetStocksByOfferIds = jest.spyOn(getStocksByOfferIdsModule, 'getStocksByOfferIds')

describe('useGetVenueByDay', () => {
  describe('items', () => {
    it('should return an empty list when the offer is not available in any cinema', async () => {
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers: [] })

      const { result } = renderUseGetVenueByDay(TODAY_DATE, offerResponseBuilder().build())

      await act(() => {})

      await expect(result.current.items).toStrictEqual([])
    })

    it('should return all the results of the indicated venue and cinema today', async () => {
      const initialNumberOfCinema = 5
      const offers = generateOfferNumber(initialNumberOfCinema, OFFER_WITH_STOCKS_TODAY)
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = await renderUseGetVenueByDay(TODAY_DATE, offerResponseBuilder().build())

      await act(async () => {})

      expect(result.current.items).toHaveLength(initialNumberOfCinema)
    })

    it('should only return cinemas having stocks today', async () => {
      const offers = [
        OFFER_WITH_STOCKS_TODAY,
        OFFER_WITH_STOCKS_TOMORROW,
        OFFER_WITH_STOCKS_TOMORROW,
      ]
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = await renderUseGetVenueByDay(TODAY_DATE, offerResponseBuilder().build())

      await act(async () => {})

      expect(result.current.items).toHaveLength(1)
    })

    it('should return the specified initial number of cinema', async () => {
      const initialNumberOfCinema = 7
      const offers = generateOfferNumber(10, OFFER_WITH_STOCKS_TODAY)

      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = await renderUseGetVenueByDay(TODAY_DATE, offerResponseBuilder().build(), {
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

      const { result } = await renderUseGetVenueByDay(TODAY_DATE, offerResponseBuilder().build(), {
        initialCount: 6,
        nextCount: 3,
      })

      await act(async () => {
        result.current.getNext()
      })

      expect(result.current.items).toHaveLength(9)
    })
  })

  describe('isEnd', () => {
    it('should be false if there are remaining items not displayed', async () => {
      const offers = generateOfferNumber(10, OFFER_WITH_STOCKS_TODAY)
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = await renderUseGetVenueByDay(TODAY_DATE, offerResponseBuilder().build(), {
        initialCount: 6,
      })

      await act(async () => {})

      expect(result.current.isEnd).toBeFalsy()
    })

    it('should be true if all items are already displayed', async () => {
      const offers = generateOfferNumber(3, OFFER_WITH_STOCKS_TODAY)
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = await renderUseGetVenueByDay(TODAY_DATE, offerResponseBuilder().build(), {
        initialCount: 6,
      })

      await act(async () => {})

      expect(result.current.isEnd).toBeTruthy()
    })

    it('should be true if items are displayed after a getNext', async () => {
      const offers = generateOfferNumber(8, OFFER_WITH_STOCKS_TODAY)
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers })

      const { result } = await renderUseGetVenueByDay(TODAY_DATE, offerResponseBuilder().build(), {
        initialCount: 6,
        nextCount: 3,
      })

      await act(async () => {
        result.current.getNext()
      })

      expect(result.current.isEnd).toBeTruthy()
    })
  })

  describe('change date', () => {
    it('should return the list of cinema for a specified date', async () => {
      const todaysOffers = generateOfferNumber(3, OFFER_WITH_STOCKS_TODAY)
      const tomorrowOffers = generateOfferNumber(5, OFFER_WITH_STOCKS_TOMORROW)

      mockedGetStocksByOfferIds.mockResolvedValueOnce({
        offers: [...todaysOffers, ...tomorrowOffers],
      })

      const offer = offerResponseBuilder().build()
      const options = {
        initialCount: 6,
        nextCount: 3,
      }

      const { result, rerender } = await renderUseGetVenueByDay(TODAY_DATE, offer, options)

      await act(async () => {
        result.current.getNext()
        rerender({ date: TOMORROW.toDate() })
      })

      expect(result.current.items).toHaveLength(5)
    })

    it('should return the initial number of cinema after using getNext', async () => {
      const todaysOffers = generateOfferNumber(10, OFFER_WITH_STOCKS_TODAY)
      const tomorrowOffers = generateOfferNumber(10, OFFER_WITH_STOCKS_TOMORROW)

      mockedGetStocksByOfferIds.mockResolvedValueOnce({
        offers: [...todaysOffers, ...tomorrowOffers],
      })

      const offer = offerResponseBuilder().build()
      const options = {
        initialCount: 6,
        nextCount: 3,
      }

      const { result, rerender } = await renderUseGetVenueByDay(TODAY_DATE, offer, options)

      await act(async () => {
        result.current.getNext()
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

      const { result } = renderUseGetVenueByDay(TODAY_DATE, offerResponseBuilder().build())

      await act(async () => {})

      expect(result.current.isLoading).toBe(true)
    })

    it('should be false when data is loaded', async () => {
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers: [] })

      const { result } = renderUseGetVenueByDay(TODAY_DATE, offerResponseBuilder().build())

      await act(async () => {})

      expect(result.current.isLoading).toBe(false)
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
