import { OfferChronicle } from 'api/gen'
import { offerChroniclesToChronicleCardData } from 'features/chronicle/adapters/offerChroniclesToChronicleCardData/offerChroniclesToChronicleCardData'
import { useChronicles } from 'features/chronicle/api/useChronicles/useChronicles'
import { offerChroniclesFixture } from 'features/chronicle/fixtures/offerChronicles.fixture'
import { ChronicleCardData } from 'features/chronicle/type'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

const subtitle = 'Membre du Book Club'

describe('useChronicles', () => {
  beforeEach(() =>
    mockServer.getApi(`/v1/offer/${offerResponseSnap.id}/chronicles`, offerChroniclesFixture)
  )

  it('should call API otherwise', async () => {
    const { result } = renderHook(
      () =>
        useChronicles({
          offerId: offerResponseSnap.id,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() =>
      expect(JSON.stringify(result.current.data)).toEqual(JSON.stringify(offerChroniclesFixture))
    )
  })

  it('should call API and format output data', async () => {
    const { result } = renderHook(
      () =>
        useChronicles<ChronicleCardData[]>({
          offerId: offerResponseSnap.id,
          select: (data) => offerChroniclesToChronicleCardData(data.chronicles, subtitle),
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await act(async () => {})

    expect(JSON.stringify(result.current.data)).toEqual(
      JSON.stringify(
        offerChroniclesToChronicleCardData(
          [...offerChroniclesFixture.chronicles] as OfferChronicle[],
          subtitle
        )
      )
    )
  })
})
