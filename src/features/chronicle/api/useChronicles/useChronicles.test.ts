import { useChronicles } from 'features/chronicle/api/useChronicles/useChronicles'
import { offerChroniclesFixture } from 'features/chronicle/fixtures/offerChronicles.fixture'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

describe('useChronicles', () => {
  beforeEach(() =>
    mockServer.getApi(`/v1/offer/${offerResponseSnap.id}/chronicles`, offerChroniclesFixture)
  )

  it('should call API otherwise', async () => {
    const { result } = renderHook(() => useChronicles({ offerId: offerResponseSnap.id }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(JSON.stringify(result.current.data)).toEqual(JSON.stringify(offerChroniclesFixture))
  })
})
