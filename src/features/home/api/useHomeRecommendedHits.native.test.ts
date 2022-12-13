import mockdate from 'mockdate'
import { UseMutationResult } from 'react-query'

import * as algoliaRecommendedHitsAPI from 'features/home/api/useAlgoliaRecommendedHits'
import {
  getRecommendationEndpoint,
  getRecommendationParameters,
  useHomeRecommendedHits,
} from 'features/home/api/useHomeRecommendedHits'
import { RecommendationParametersFields } from 'libs/contentful'
import { env } from 'libs/environment'
import { RecommendedIdsRequest, RecommendedIdsResponse } from 'libs/recommendation/types'
import * as recommendedIdsAPI from 'libs/recommendation/useHomeRecommendedIdsMutation'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { renderHook } from 'tests/utils'

const mockUserId = 1234
const position = {
  latitude: 6,
  longitude: 22,
}
const mockModuleId = 'abcd'
mockdate.set(new Date('2022-11-25T00:00+00:00'))

describe('useHomeRecommendedHits', () => {
  const mutate = jest.fn()
  jest
    .spyOn(recommendedIdsAPI, 'useHomeRecommendedIdsMutation')
    .mockReturnValue({ mutate } as unknown as UseMutationResult<
      RecommendedIdsResponse,
      unknown,
      RecommendedIdsRequest,
      unknown
    >)

  const algoliaSpy = jest
    .spyOn(algoliaRecommendedHitsAPI, 'useAlgoliaRecommendedHits')
    .mockImplementation(jest.fn())

  it('should not call recommendation mutation when user is not connected', () => {
    renderHook(() => useHomeRecommendedHits(undefined, position, mockModuleId))
    expect(mutate).not.toHaveBeenCalled()
  })

  it('should call recommendation mutation when user is connected', () => {
    renderHook(() => useHomeRecommendedHits(mockUserId, position, mockModuleId))
    expect(mutate).toHaveBeenCalledTimes(1)
  })

  it('should call algolia hook', () => {
    renderHook(() => useHomeRecommendedHits(undefined, position, mockModuleId))
    expect(algoliaSpy).toHaveBeenCalledTimes(1)
    renderHook(() => useHomeRecommendedHits(mockUserId, position, mockModuleId))
    expect(algoliaSpy).toHaveBeenCalledTimes(2)
  })
})

describe('getRecommendationEndpoint', () => {
  it('should return undefined when no user id is provided', () => {
    const endpoint = getRecommendationEndpoint(undefined, null)
    expect(endpoint).toBeUndefined()
  })
  it('should return endpoint with latitude and longitude query params when position is provided', () => {
    const endpoint = getRecommendationEndpoint(mockUserId, position)
    expect(endpoint).toEqual(
      `${env.RECOMMENDATION_ENDPOINT}/playlist_recommendation/${mockUserId}?token=${env.RECOMMENDATION_TOKEN}&longitude=${position.longitude}&latitude=${position.latitude}`
    )
  })
})

describe('getRecommendationParameters', () => {
  const subcategoryLabelMapping = useSubcategoryLabelMapping()
  it('should return empty parameters when no parameters are provided', () => {
    const result = getRecommendationParameters(undefined, subcategoryLabelMapping)
    expect(result).toEqual({})
  })

  it('should return parameters with mapped categories when parameters are provided', () => {
    const parameters: RecommendationParametersFields = {
      title: 'some parameters',
      categories: ['Arts & loisirs créatifs', 'Bibliothèques, Médiathèques', 'Cartes jeunes'],
      isFree: true,
      isEvent: true,
      isDuo: true,
      priceMax: 10,
      endingDatetime: '2022-05-08T00:00+00:00',
      beginningDatetime: '2022-09-08T00:00+00:00',
      subcategories: ['Achat instrument'],
    }
    const recommendationParameters = getRecommendationParameters(
      parameters,
      subcategoryLabelMapping
    )
    expect(recommendationParameters).toEqual({
      categories: ['ARTS_LOISIRS_CREATIFS', 'BIBLIOTHEQUES_MEDIATHEQUE', 'CARTES_JEUNES'],
      end_date: '2022-05-08T00:00+00:00',
      start_date: '2022-09-08T00:00+00:00',
      price_max: 0,
      isEvent: true,
      isDuo: true,
      subcategories: ['ACHAT_INSTRUMENT'],
    })
  })

  it('should return parameters with isRecoShuffled when provided', () => {
    const parameters: RecommendationParametersFields = {
      title: 'some parameters',
      isRecoShuffled: true,
    }
    const recommendationParameters = getRecommendationParameters(
      parameters,
      subcategoryLabelMapping
    )
    expect(recommendationParameters).toEqual({
      categories: [],
      subcategories: [],
      isRecoShuffled: true,
    })
  })
})
