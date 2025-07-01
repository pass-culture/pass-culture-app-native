import mockdate from 'mockdate'

import { useListExpander } from 'features/offer/helpers/useListExpander/useListExpander'
import { LocationMode, Position } from 'libs/location/types'
import { dateBuilder, mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

const TODAY = dateBuilder().withDay(2).withHours(6)
const TODAY_LATER = dateBuilder().withDay(2).withHours(10)
const TOMORROW = dateBuilder().withDay(3)

const TODAY_STOCK = mockBuilder.offerStockResponse({
  beginningDatetime: TODAY_LATER.toString(),
})

const TOMORROW_STOCK = mockBuilder.offerStockResponse({
  beginningDatetime: TOMORROW.toString(),
})

const OFFER_WITH_STOCKS_TODAY = mockBuilder.offerResponseV2({
  stocks: [TODAY_STOCK],
})

const OFFER_WITH_STOCKS_TOMORROW = mockBuilder.offerResponseV2({
  stocks: [TOMORROW_STOCK],
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

mockdate.set(TODAY.toDate())

describe('useListExpander', () => {
  it('should return the specified initial number of cinema', async () => {
    const initialNumberOfCinema = 7
    const offers = generateOfferNumber(10, OFFER_WITH_STOCKS_TODAY)

    const { result } = renderUseListExpander(offers, {
      initialCount: initialNumberOfCinema,
    })

    await act(async () => {})

    expect(result.current.items).toHaveLength(initialNumberOfCinema)
  })

  it('should return the initial number of elements after the list change', async () => {
    const todaysOffers = generateOfferNumber(10, OFFER_WITH_STOCKS_TODAY)
    const tomorrowOffers = generateOfferNumber(10, OFFER_WITH_STOCKS_TOMORROW)
    const options = {
      initialCount: 6,
      nextCount: 3,
    }

    const { result, rerender } = renderUseListExpander(todaysOffers, options)

    await act(async () => {
      result.current.showMore()
    })
    await act(async () => {
      rerender({ list: tomorrowOffers })
    })

    await act(async () => {
      rerender({ list: todaysOffers })
    })

    expect(result.current.items).toHaveLength(6)
  })

  describe('hasReachedEnd', () => {
    it('should be false if there are remaining items not displayed', async () => {
      const offers = generateOfferNumber(10, OFFER_WITH_STOCKS_TODAY)

      const { result } = renderUseListExpander(offers, {
        initialCount: 6,
      })

      await act(async () => {})

      expect(result.current.hasReachedEnd).toBeFalsy()
    })

    it('should be true if all items are already displayed', async () => {
      const offers = generateOfferNumber(3, OFFER_WITH_STOCKS_TODAY)

      const { result } = renderUseListExpander(offers, {
        initialCount: 6,
      })

      await act(async () => {})

      expect(result.current.hasReachedEnd).toBeTruthy()
    })

    it('should be true if items are displayed after a showMore', async () => {
      const offers = generateOfferNumber(8, OFFER_WITH_STOCKS_TODAY)

      const { result } = renderUseListExpander(offers, {
        initialCount: 6,
        nextCount: 3,
      })

      await act(async () => {
        result.current.showMore()
      })

      expect(result.current.hasReachedEnd).toBeTruthy()
    })
  })

  describe('showMore', () => {
    it('should return the number of more specified cinema', async () => {
      const offers = generateOfferNumber(10, OFFER_WITH_STOCKS_TODAY)

      const { result } = renderUseListExpander(offers, {
        initialCount: 6,
        nextCount: 3,
      })

      await act(async () => {
        result.current.showMore()
      })

      expect(result.current.items).toHaveLength(9)
    })
  })
})

const renderUseListExpander = (...params: Parameters<typeof useListExpander>) =>
  renderHook(({ list }) => useListExpander(list, params[1]), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
    initialProps: { list: params[0] },
  })

function generateOfferNumber<T>(length: number, element: T): T[] {
  return new Array(length).fill(element)
}
