import { offerProAdvicesFixture } from 'features/advices/fixtures/offerProAdvices.fixture'
import { useOfferProAdvicesQuery } from 'features/advices/queries/useOfferProAdvicesQuery'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

describe('useOfferProAdvicesQuery', () => {
  beforeEach(() => mockServer.getApi(`/v1/offer/1/advices`, offerProAdvicesFixture))

  it('should call API otherwise when wipProReviewsOffer FF activated', async () => {
    const { result } = renderHook(
      () =>
        useOfferProAdvicesQuery({
          offerId: 1,
          enableProAdvices: true,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() =>
      expect(JSON.stringify(result.current.data)).toEqual(JSON.stringify(offerProAdvicesFixture))
    )
  })

  it('should not call API otherwise when wipProReviewsOffer FF deactivated', async () => {
    const { result } = renderHook(
      () =>
        useOfferProAdvicesQuery({
          offerId: 1,
          enableProAdvices: false,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => expect(JSON.stringify(result.current.data)).toEqual(undefined))
  })
})
