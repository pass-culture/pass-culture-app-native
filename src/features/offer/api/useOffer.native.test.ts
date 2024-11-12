import { OfferResponseV2 } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { useOffer } from './useOffer'

jest.mock('libs/network/NetInfoWrapper')

describe('useOffer', () => {
  beforeEach(() =>
    mockServer.getApi<OfferResponseV2>(`/v2/offer/${offerResponseSnap.id}`, offerResponseSnap)
  )

  it('should call API otherwise', async () => {
    const { result } = renderHook(() => useOffer({ offerId: offerResponseSnap.id }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(JSON.stringify(result.current.data)).toEqual(JSON.stringify(offerResponseSnap))
  })
})
