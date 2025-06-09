import mockdate from 'mockdate'

import * as getStocksByOfferIdsModule from 'features/offer/api/getStocksByOfferIds'
import { useOffersStocksFromOfferQuery } from 'features/offer/queries/useOffersStocksFromOfferQuery'
import * as fetchAlgoliaOffer from 'libs/algolia/fetchAlgolia/fetchOffers'
import { LocationMode, Position } from 'libs/location/types'
import { dateBuilder, mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

const TODAY = dateBuilder().withDay(2).withHours(6)
const TODAY_LATER = dateBuilder().withDay(2).withHours(10)

const TODAY_STOCK = mockBuilder.offerStockResponse({
  beginningDatetime: TODAY_LATER.toString(),
})

const OFFER_WITH_STOCKS_TODAY = mockBuilder.offerResponseV2({
  stocks: [TODAY_STOCK],
})

const OFFER_WITHOUT_ALLOCINE_ID = mockBuilder.offerResponseV2({ extraData: { allocineId: null } })

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

mockdate.set(TODAY.toDate())

jest.useFakeTimers()

describe('useOffersStocksFromOfferQuery', () => {
  it('should call fetchOffers with allocineId when provided', async () => {
    renderUseOffersStocksFromOfferQuery(OFFER_WITH_STOCKS_TODAY)
    const allocineId = OFFER_WITH_STOCKS_TODAY.extraData?.allocineId

    await act(() => {})

    expect(fetchOffersSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        parameters: expect.objectContaining({ allocineId }),
      })
    )
  })

  it('should call fetchOffers with offerId when no allocineId is provided', async () => {
    renderUseOffersStocksFromOfferQuery(OFFER_WITHOUT_ALLOCINE_ID)
    const offerId = OFFER_WITHOUT_ALLOCINE_ID.id.toString()

    await act(() => {})

    expect(fetchOffersSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        parameters: expect.objectContaining({ objectIds: [offerId] }),
      })
    )
  })

  describe('isLoading', () => {
    it('should be true when fetching data', async () => {
      mockedGetStocksByOfferIds.mockReturnValueOnce(new Promise(jest.fn())) // Never resolve promise to simulate loading

      const { result } = renderUseOffersStocksFromOfferQuery(OFFER_WITH_STOCKS_TODAY)

      await waitFor(async () => expect(result.current.isFetched).toEqual(false))

      expect(result.current.isLoading).toBe(true)
    })

    it('should be false when data is loaded', async () => {
      mockedGetStocksByOfferIds.mockResolvedValueOnce({ offers: [] })

      const { result } = renderUseOffersStocksFromOfferQuery(OFFER_WITH_STOCKS_TODAY)

      await waitFor(async () => expect(result.current.isFetched).toEqual(true))

      expect(result.current.isLoading).toBe(false)
    })
  })
})

const renderUseOffersStocksFromOfferQuery = (
  ...params: Parameters<typeof useOffersStocksFromOfferQuery>
) =>
  renderHook(() => useOffersStocksFromOfferQuery(...params), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
