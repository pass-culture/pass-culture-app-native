import { OffersStocksResponse } from 'api/gen'
import { offersStocksResponseSnap } from 'features/offer/fixtures/offersStocksResponse'
import { convertOffererDatesToTimezone } from 'features/offer/queries/selectors/convertOffererDatesToTimezone'
import { useOffersStocksSpecialEventQuery } from 'features/offer/queries/useOffersStocksSpecialEventQuery'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/firebase/analytics/analytics')

const timezonedOffersStocksResponseSnap = convertOffererDatesToTimezone(offersStocksResponseSnap)

describe('useOffersStocksSpecialEventQuery', () => {
  beforeEach(() => {
    mockServer.postApi<OffersStocksResponse>(`/v3/offers/stocks`, offersStocksResponseSnap)
  })

  it('should call API', async () => {
    const { result } = renderHook(
      () => useOffersStocksSpecialEventQuery({ offerIds: [offersStocksResponseSnap.offers[0].id] }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => expect(result.current.isSuccess).toEqual(true))

    expect(JSON.stringify(result.current.data)).toEqual(
      JSON.stringify(timezonedOffersStocksResponseSnap)
    )
  })
})
