import { renderHook, cleanup } from '@testing-library/react-hooks'
import { rest } from 'msw'

import { RecommendationPane } from 'features/home/contentful/moduleTypes'
import * as SearchModule from 'libs/search'
import { mockedAlgoliaResponse } from 'libs/search/fixtures'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { waitFor } from 'tests/utils'

import { useHomeRecommendedHits, getRecommendationEndpoint } from '../useHomeRecommendedHits'

const mockUserId = 30
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { id: mockUserId } })),
}))
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({})),
}))

const objectIds = mockedAlgoliaResponse.hits.map(({ objectID }) => objectID)

const fetchHits = jest.spyOn(SearchModule, 'fetchHits').mockResolvedValue({
  results: mockedAlgoliaResponse.hits,
})

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
      expect(fetchHits).not.toHaveBeenCalled()
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
      expect(fetchHits).toHaveBeenCalledTimes(1)
      expect(fetchHits).toHaveBeenCalledWith(objectIds)
    })
  })
})
