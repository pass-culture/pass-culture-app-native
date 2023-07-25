import { useHighlightOffer } from 'features/home/api/useHighlightOffer'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { fetchOffersByIds } from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import { offersFixture } from 'shared/offer/offer.fixture'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/algolia/fetchAlgolia/fetchOffersByIds', () => ({
  fetchOffersByIds: jest.fn(),
}))
const mockfetchOffersByIds = fetchOffersByIds as jest.MockedFunction<typeof fetchOffersByIds>

const mockOffers: Offer[] = mockedAlgoliaResponse.hits

describe('useHighlightOffer', () => {
  it('should return offer when offerId is provided', async () => {
    mockfetchOffersByIds.mockResolvedValueOnce([mockOffers[0]])

    const { result } = renderHook(() => useHighlightOffer('moduleId', 'offerId1'), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})
    expect(result.current).toEqual(offersFixture[0])
  })

  it('should return undefined when no offer id is provided', async () => {
    const { result } = renderHook(() => useHighlightOffer('moduleId'), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})
    expect(result.current).toBe(undefined)
  })
})
