import { OfferChronicle } from 'api/gen'
import { AdviceCardData } from 'features/advices/types'
import { clubAdvicesToAdviceCardData } from 'features/clubAdvices/adapters/clubAdvicesToAdviceCardData/clubAdvicesToAdviceCardData'
import { offerClubAdvicesFixture } from 'features/clubAdvices/fixtures/clubAdvices.fixture'
import { useClubAdvicesQuery } from 'features/clubAdvices/queries/useClubAdvicesQuery'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

const subtitle = 'Membre du Book Club'

describe('useClubAdvicesQuery', () => {
  beforeEach(() =>
    mockServer.getApi(`/v1/offer/${offerResponseSnap.id}/chronicles`, offerClubAdvicesFixture)
  )

  it('should call API otherwise', async () => {
    const { result } = renderHook(
      () =>
        useClubAdvicesQuery({
          offerId: offerResponseSnap.id,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() =>
      expect(JSON.stringify(result.current.data)).toEqual(JSON.stringify(offerClubAdvicesFixture))
    )
  })

  it('should call API and format output data', async () => {
    const { result } = renderHook(
      () =>
        useClubAdvicesQuery<AdviceCardData[]>({
          offerId: offerResponseSnap.id,
          select: (data) => clubAdvicesToAdviceCardData(data.chronicles, subtitle),
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(async () => expect(result.current.isFetched).toEqual(true))

    expect(JSON.stringify(result.current.data)).toEqual(
      JSON.stringify(
        clubAdvicesToAdviceCardData(
          [...offerClubAdvicesFixture.chronicles] as OfferChronicle[],
          subtitle
        )
      )
    )
  })
})
