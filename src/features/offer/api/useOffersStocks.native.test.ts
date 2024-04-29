import { OffersStocksResponse } from 'api/gen'
import { useOffersStocks } from 'features/offer/api/useOffersStocks'
import { offersStocksResponseSnap } from 'features/offer/fixtures/offersStocksResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

describe('useOffersStocks', () => {
  beforeEach(() => {
    mockServer.postApi<OffersStocksResponse>(`/v1/offers/stocks`, offersStocksResponseSnap)
  })

  it('should call API', async () => {
    const { result } = renderHook(
      () => useOffersStocks({ offerIds: [offersStocksResponseSnap.offers[0].id] }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await act(async () => {})

    expect(JSON.stringify(result.current.data)).toEqual(JSON.stringify(offersStocksResponseSnap))
  })
})
