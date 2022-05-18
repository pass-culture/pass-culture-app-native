import { renderHook, cleanup } from '@testing-library/react-hooks'
import { rest } from 'msw'

import { RecommendationParametersFields } from 'features/home/contentful'
import * as AlgoliaModule from 'libs/algolia/fetchAlgolia/fetchAlgolia'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { env } from 'libs/environment'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { waitFor } from 'tests/utils'

import {
  useHomeRecommendedHits,
  getRecommendationEndpoint,
  getRecommendationParameters,
} from '../useHomeRecommendedHits'

const mockUserId = 30
jest.mock('features/profile/api', () => ({
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
      rest.post(endpoint, (_req, res, ctx) =>
        res(ctx.status(200), ctx.json({ playlist_recommended_offers: objectIds }))
      )
    )
  })

  afterEach(async () => {
    await cleanup()
  })

  it('should not make any call if there is no recommendation module', async () => {
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

describe('getRecommendationEndpoint', () => {
  it('should return undefined if no user id is provided', () => {
    const endpoint = getRecommendationEndpoint(undefined, null)
    expect(endpoint).toBeUndefined()
  })

  it('should return endpoint with latitude and longitude query params if position is provided', () => {
    const position = {
      latitude: 6,
      longitude: 22,
    }
    const endpoint = getRecommendationEndpoint(mockUserId, position)
    expect(endpoint).toEqual(
      `${env.RECOMMENDATION_ENDPOINT}/playlist_recommendation/${mockUserId}?token=${env.RECOMMENDATION_TOKEN}&longitude=${position.longitude}&latitude=${position.latitude}`
    )
  })
})

describe('getRecommendationParameters', () => {
  it('should return empty parameters when no parameters are provided', () => {
    const result = getRecommendationParameters(undefined)
    expect(result).toEqual({})
  })

  it('should return parameters with mapped categories if provided', () => {
    const parameters: RecommendationParametersFields = {
      title: 'some parameters',
      categories: ['Cinéma', 'Cours, ateliers', 'Livres'],
      isFree: false,
      isEvent: true,
      priceMax: 10,
      endingDatetime: '2022-05-08T00:00+02:00',
      beginningDatetime: '2022-09-08T00:00+02:00',
    }
    const recommendationParameters = getRecommendationParameters(parameters)
    expect(recommendationParameters).toEqual({
      categories: ['CINEMA', 'COURS', 'LIVRE'],
      end_date: '2022-05-08T00:00+02:00',
      start_date: '2022-09-08T00:00+02:00',
      price_max: 10,
      isEvent: true,
    })
  })
})
