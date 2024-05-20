import mockdate from 'mockdate'
import { UseQueryResult } from 'react-query'

import * as algoliaRecommendedOffersAPI from 'features/home/api/useAlgoliaRecommendedOffers'
import {
  getRecommendationParameters,
  useHomeRecommendedOffers,
} from 'features/home/api/useHomeRecommendedOffers'
import { RecommendedOffersModule, RecommendedOffersParameters } from 'features/home/types'
import { RecommendedIdsResponse } from 'libs/recommendation/types'
import * as recommendedIdsAPI from 'libs/recommendation/useHomeRecommendedIdsQuery'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { renderHook } from 'tests/utils'

const position = {
  latitude: 6,
  longitude: 22,
}
const mockModuleId = 'abcd'
mockdate.set(new Date('2022-11-25T00:00+00:00'))

const mockSubcategories = PLACEHOLDER_DATA.subcategories
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
    },
  }),
}))

describe('useHomeRecommendedOffers', () => {
  jest
    .spyOn(recommendedIdsAPI, 'useHomeRecommendedIdsQuery')
    .mockReturnValue({ data: { playlist_recommended_offers: ['1234'] } } as UseQueryResult<
      RecommendedIdsResponse,
      unknown
    >)

  const algoliaSpy = jest
    .spyOn(algoliaRecommendedOffersAPI, 'useAlgoliaRecommendedOffers')
    .mockImplementation(jest.fn())

  it('should call algolia hook', () => {
    renderHook(() => useHomeRecommendedOffers(undefined, position, mockModuleId))

    expect(algoliaSpy).toHaveBeenCalledWith(['1234'], 'abcd', true)
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
      categories: ['Arts & loisirs créatifs', 'Cartes jeunes'],
      isEvent: true,
      isDuo: true,
      priceMax: 10,
      endingDatetime: '2022-05-08T00:00+00:00',
      beginningDatetime: '2022-09-08T00:00+00:00',
      subcategories: ['Achat instrument'],
      bookTypes: ['Carrière/Concours', 'Scolaire & Parascolaire', 'Gestion/entreprise'],
      movieGenres: ['ACTION', 'SPY'],
      musicTypes: ['Pop'],
      showTypes: ['Danse'],
    }
    const recommendationParameters = getRecommendationParameters(
      parameters,
      subcategoryLabelMapping
    )

    expect(recommendationParameters).toEqual({
      categories: ['ARTS_LOISIRS_CREATIFS', 'CARTES_JEUNES'],
      end_date: '2022-05-08T00:00+00:00',
      start_date: '2022-09-08T00:00+00:00',
      price_max: 10,
      isEvent: true,
      isDuo: true,
      subcategories: ['ACHAT_INSTRUMENT'],
      offerTypeList: [
        { key: 'BOOK', value: 'Carrière/Concours' },
        { key: 'BOOK', value: 'Scolaire & Parascolaire' },
        { key: 'BOOK', value: 'Gestion/entreprise' },
        { key: 'MOVIE', value: 'ACTION' },
        { key: 'MOVIE', value: 'SPY' },
        { key: 'MUSIC', value: 'Pop' },
        { key: 'SHOW', value: 'Danse' },
      ],
    })
  })

  it('should return parameters with isRecoShuffled when provided', () => {
    const parameters: RecommendedOffersParameters = {
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
      offerTypeList: [],
    })
  })
})
