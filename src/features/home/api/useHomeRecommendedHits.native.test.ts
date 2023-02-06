import mockdate from 'mockdate'
import { UseMutationResult } from 'react-query'

import * as algoliaRecommendedHitsAPI from 'features/home/api/useAlgoliaRecommendedHits'
import {
  getRecommendationParameters,
  useHomeRecommendedHits,
} from 'features/home/api/useHomeRecommendedHits'
import { RecommendedOffersModule } from 'features/home/types'
import { RecommendationParametersFields } from 'libs/contentful'
import { RecommendedIdsRequest, RecommendedIdsResponse } from 'libs/recommendation/types'
import * as recommendedIdsAPI from 'libs/recommendation/useHomeRecommendedIdsMutation'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { renderHook } from 'tests/utils'

const mockUserId = 1234
const position = {
  latitude: 6,
  longitude: 22,
}
const mockModuleId = 'abcd'
mockdate.set(new Date('2022-11-25T00:00+00:00'))

const mockSubcategories = placeholderData.subcategories
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
    },
  }),
}))

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

describe('getRecommendationParameters', () => {
  const {
    result: { current: subcategoryLabelMapping },
  } = renderHook(useSubcategoryLabelMapping)

  it('should return empty parameters when no parameters are provided', () => {
    const result = getRecommendationParameters(undefined, subcategoryLabelMapping)
    expect(result).toEqual({})
  })

  it('should return parameters with mapped categories when parameters are provided', () => {
    const parameters: RecommendedOffersModule['recommendationParameters'] = {
      categories: ['Arts & loisirs créatifs', 'Bibliothèques, Médiathèques', 'Cartes jeunes'],
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
      price_max: 10,
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
