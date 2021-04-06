import { renderHook, cleanup } from '@testing-library/react-hooks'
import { rest } from 'msw'

import { RecommendationPane } from 'features/home/contentful/moduleTypes'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { waitFor } from 'tests/utils'

import { useHomeRecommendedHits, getRecommendationEndpoint } from '../useHomeRecommendedHits'

const mockUserId = 30
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { id: mockUserId } })),
}))

const objectIds = mockedAlgoliaResponse.hits.map(({ objectID }) => objectID)

const mockFetchAlgoliaHits = jest.fn().mockResolvedValue({
  results: mockedAlgoliaResponse.hits,
})
jest.mock('libs/algolia/fetchAlgolia', () => ({
  fetchAlgoliaHits: (objectIds: string[]) => mockFetchAlgoliaHits(objectIds),
}))

const endpoint = getRecommendationEndpoint(mockUserId, null) as string

describe('useHomeRecommendedHits', () => {
  beforeEach(() => {
    server.use(
      rest.get(endpoint, (_req, res, ctx) =>
        res(ctx.status(200), ctx.json({ recommended_offers: objectIds }))
      )
    )
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await cleanup()
  })

  it('not make any call if there is no recommendation module', async () => {
    renderHook(() => useHomeRecommendedHits(undefined), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(mockFetchAlgoliaHits).not.toHaveBeenCalled()
      expect(queryCache.get('recommendationOfferIds')).toBeUndefined()
      expect(queryCache.get('recommendationHits')).toBeUndefined()
    })
  })

  it('calls fetchAlgolia with params and returns data', async () => {
    const recommendationModule = new RecommendationPane({
      display: { title: 'Offres recommandées', layout: 'one-item-medium', minOffers: 4 },
    })
    const { result } = renderHook(() => useHomeRecommendedHits(recommendationModule), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current).toHaveLength(4)
      expect(mockFetchAlgoliaHits).toHaveBeenCalledTimes(1)
      expect(mockFetchAlgoliaHits).toHaveBeenCalledWith(objectIds)
    })
  })
})
