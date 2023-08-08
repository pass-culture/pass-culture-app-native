import { useHighlightOffer } from 'features/home/api/useHighlightOffer'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { fetchOffersByEan } from 'libs/algolia/fetchAlgolia/fetchOffersByEan'
import { fetchOffersByIds } from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import { fetchOffersByTags } from 'libs/algolia/fetchAlgolia/fetchOffersByTags'
import { offersFixture } from 'shared/offer/offer.fixture'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/algolia/fetchAlgolia/fetchOffersByIds', () => ({
  fetchOffersByIds: jest.fn(),
}))
const mockFetchOffersByIds = fetchOffersByIds as jest.MockedFunction<typeof fetchOffersByIds>

jest.mock('libs/algolia/fetchAlgolia/fetchOffersByTags', () => ({
  fetchOffersByTags: jest.fn(),
}))
const mockFetchOffersByTags = fetchOffersByTags as jest.MockedFunction<typeof fetchOffersByTags>

jest.mock('libs/algolia/fetchAlgolia/fetchOffersByEan', () => ({
  fetchOffersByEan: jest.fn(),
}))
const mockFetchOffersByEan = fetchOffersByEan as jest.MockedFunction<typeof fetchOffersByEan>

const mockOffers: Offer[] = mockedAlgoliaResponse.hits

describe('useHighlightOffer', () => {
  it('should return offer when offerId is provided', async () => {
    mockFetchOffersByIds.mockResolvedValueOnce([mockOffers[0]])

    const { result } = renderUseHighlightOfferHook({ offerId: 'offerId1' })

    await act(async () => {})
    expect(result.current).toEqual(offersFixture[0])
  })

  it('should return offer when offerTag is provided', async () => {
    mockFetchOffersByTags.mockResolvedValueOnce([mockOffers[0]])

    const { result } = renderUseHighlightOfferHook({ offerTag: 'test-tag' })

    await act(async () => {})
    expect(result.current).toEqual(offersFixture[0])
  })

  it('should return offer when offerEan is provided', async () => {
    mockFetchOffersByEan.mockResolvedValueOnce([mockOffers[0]])

    const { result } = renderUseHighlightOfferHook({ offerEan: '1234567891234' })

    await act(async () => {})
    expect(result.current).toEqual(offersFixture[0])
  })

  it('should return undefined when no offer id or tag or ean is provided', async () => {
    const { result } = renderUseHighlightOfferHook({})

    await act(async () => {})
    expect(result.current).toBe(undefined)
  })
})

type Params = { offerId?: string; offerEan?: string; offerTag?: string }

function renderUseHighlightOfferHook(params: Params) {
  return renderHook(() => useHighlightOffer({ id: 'moduleId', ...params }), {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
