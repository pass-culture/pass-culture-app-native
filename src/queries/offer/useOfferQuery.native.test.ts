import { OfferResponseV2 } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useOfferQuery } from './useOfferQuery'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/firebase/analytics/analytics')

describe('useOfferQuery', () => {
  beforeEach(() =>
    mockServer.getApi<OfferResponseV2>(`/v2/offer/${offerResponseSnap.id}`, offerResponseSnap)
  )

  it('should call API otherwise', async () => {
    const { result } = renderHook(() => useOfferQuery({ offerId: offerResponseSnap.id }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(JSON.stringify(result.current.data)).toEqual(JSON.stringify(offerResponseSnap))
  })

  it('should call and API return formated data', async () => {
    const { result } = renderHook(
      () => useOfferQuery<string>({ offerId: offerResponseSnap.id, select: (data) => data?.name }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(result.current.data).toBe(offerResponseSnap.name)
  })
})
