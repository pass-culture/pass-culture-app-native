import { OffersStocksResponseV2 } from 'api/gen'
import { offersStocksResponseSnap } from 'features/offer/fixtures/offersStocksResponse'
import { useOffersStocksQuery } from 'features/offer/queries/useOffersStocksQuery'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/firebase/analytics/analytics')

describe('useOffersStocksQuery', () => {
  beforeEach(() => {
    mockServer.postApi<OffersStocksResponseV2>(`/v2/offers/stocks`, offersStocksResponseSnap)
  })

  it('should call API', async () => {
    const { result } = renderHook(
      () => useOffersStocksQuery({ offerIds: [offersStocksResponseSnap.offers[0].id] }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await act(async () => {})

    expect(JSON.stringify(result.current.data)).toEqual(JSON.stringify(offersStocksResponseSnap))
  })
})
