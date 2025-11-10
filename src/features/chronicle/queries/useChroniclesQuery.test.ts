import { OfferChronicle } from 'api/gen'
import { offerChroniclesToChronicleCardData } from 'features/chronicle/adapters/offerChroniclesToChronicleCardData/offerChroniclesToChronicleCardData'
import { offerChroniclesFixture } from 'features/chronicle/fixtures/offerChronicles.fixture'
import { useChroniclesQuery } from 'features/chronicle/queries/useChroniclesQuery'
import { ChronicleCardData } from 'features/chronicle/type'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

const subtitle = 'Membre du Book Club'

describe('useChronicles', () => {
  beforeEach(() =>
    mockServer.getApi(`/v1/offer/${offerResponseSnap.id}/chronicles`, offerChroniclesFixture)
  )

  it('should call API otherwise', async () => {
    const { result } = renderHook(
      () =>
        useChroniclesQuery({
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
        useChroniclesQuery<ChronicleCardData[]>({
          offerId: offerResponseSnap.id,
          select: (data) => offerChroniclesToChronicleCardData(data.chronicles, subtitle),
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(async () => expect(result.current.isFetched).toEqual(true))

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
