import { renderHook, cleanup } from '@testing-library/react-hooks'
import { rest } from 'msw'

import * as AlgoliaModule from 'libs/algolia/fetchAlgolia/fetchAlgolia'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { waitFor } from 'tests/utils'

import { useHomeRecommendedHits, getRecommendationEndpoint } from '../useHomeRecommendedHits'

const mockUserId = 30
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { id: mockUserId } })),
}))
jest.mock('features/auth/settings')

const objectIds = mockedAlgoliaResponse.hits.map(({ objectID }) => objectID)

const fetchHits = jest.fn().mockResolvedValue(mockedAlgoliaResponse.hits)
jest.spyOn(AlgoliaModule, 'fetchAlgoliaHits').mockImplementation(fetchHits)

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
    await cleanup()
  })

  it('not make any call if there is no recommendation module', async () => {
    renderHook(() => useHomeRecommendedHits(undefined, null), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(fetchHits).not.toHaveBeenCalled()
      expect(queryCache.get('recommendationOfferIds')).toBeUndefined()
      expect(queryCache.get('recommendationHits')).toBeUndefined()
    })
  })

  it('calls fetchAlgolia with params and returns data', async () => {
    const { result } = renderHook(() => useHomeRecommendedHits(mockUserId, null), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    const isUserUnderage = false
    await waitFor(() => {
      expect(result.current).toHaveLength(4)
      expect(fetchHits).toHaveBeenCalledTimes(1)
      expect(fetchHits).toHaveBeenCalledWith(objectIds, isUserUnderage)
    })
  })
})
