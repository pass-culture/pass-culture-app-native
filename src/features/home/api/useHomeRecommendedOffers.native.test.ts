import mockdate from 'mockdate'
import { UseQueryResult } from '@tanstack/react-query'

import { PlaylistResponse, SubcategoryIdEnumv2 } from 'api/gen'
import {
  getRecommendationParameters,
  useHomeRecommendedOffers,
} from 'features/home/api/useHomeRecommendedOffers'
import { RecommendedOffersModule, RecommendedOffersParameters } from 'features/home/types'
import { useSubcategoryIdsFromSearchGroups } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { getCategoriesFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getCategoriesFacetFilters'
import { QueryKeys } from 'libs/queryKeys'
import * as recommendedIdsAPI from 'libs/recommendation/useHomeRecommendedIdsQuery'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import * as algoliaSimilarOffersAPI from 'queries/offer/useAlgoliaSimilarOffersQuery'
import { renderHook } from 'tests/utils'

const position = {
  latitude: 6,
  longitude: 22,
}
const mockModuleId = 'abcd'
mockdate.set(new Date('2022-11-25T00:00+00:00'))

jest.mock('libs/subcategories/useSubcategories')

jest.mock('libs/firebase/analytics/analytics')

describe('useHomeRecommendedOffers', () => {
  it('should call algolia hook', () => {
    jest
      .spyOn(recommendedIdsAPI, 'useHomeRecommendedIdsQuery')
      .mockReturnValueOnce({ data: { playlistRecommendedOffers: ['1234'] } } as UseQueryResult<
        PlaylistResponse,
        unknown
      >)

    const algoliaSpy = jest
      .spyOn(algoliaSimilarOffersAPI, 'useAlgoliaSimilarOffersQuery')
      .mockImplementationOnce(jest.fn())

    renderHook(() => useHomeRecommendedOffers(position, mockModuleId))

    expect(algoliaSpy).toHaveBeenCalledWith(['1234'], true, [
      QueryKeys.RECOMMENDATION_HITS,
      'abcd',
      ['1234'],
    ])
  })
})

jest.mock('libs/firebase/analytics/analytics')

describe('getRecommendationParameters', () => {
  const {
    result: { current: subcategoryLabelMapping },
  } = renderHook(useSubcategoryLabelMapping)

  it('should return empty parameters when no parameters are provided', () => {
    const result = getRecommendationParameters(undefined, [])

    expect(result).toEqual({})
  })

  it('should return parameters with mapped categories when parameters are provided', () => {
    const parameters: RecommendedOffersModule['recommendationParameters'] = {
      categories: ['Cinéma'],
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

    const categories = (parameters?.categories ?? []).map(getCategoriesFacetFilters)
    const subcategories = (parameters?.subcategories ?? [])
      .map((subcategoryLabel) => subcategoryLabelMapping[subcategoryLabel])
      .filter((subcategory): subcategory is SubcategoryIdEnumv2 => subcategory !== undefined)
    const subcategoryIds = useSubcategoryIdsFromSearchGroups(categories)
    const recommendationParameters = getRecommendationParameters(parameters, [
      ...subcategories,
      ...subcategoryIds,
    ])

    expect(recommendationParameters).toEqual({
      endDate: '2022-05-08T00:00+00:00',
      startDate: '2022-09-08T00:00+00:00',
      priceMax: 10,
      isEvent: true,
      isDuo: true,
      subcategories: [
        'ACHAT_INSTRUMENT',
        'CARTE_CINE_ILLIMITE',
        'CARTE_CINE_MULTISEANCES',
        'CINE_PLEIN_AIR',
        'CINE_VENTE_DISTANCE',
        'EVENEMENT_CINE',
        'FESTIVAL_CINE',
        'SEANCE_CINE',
      ],
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
      categories: ['Cinéma'],
      isRecoShuffled: true,
    }
    const categories = (parameters?.categories ?? []).map(getCategoriesFacetFilters)
    const subcategories = (parameters?.subcategories ?? [])
      .map((subcategoryLabel) => subcategoryLabelMapping[subcategoryLabel])
      .filter((subcategory): subcategory is SubcategoryIdEnumv2 => subcategory !== undefined)
    const subcategoryIds = useSubcategoryIdsFromSearchGroups(categories)
    const recommendationParameters = getRecommendationParameters(parameters, [
      ...subcategories,
      ...subcategoryIds,
    ])

    expect(recommendationParameters).toEqual({
      isRecoShuffled: true,
      offerTypeList: [],
      subcategories: [
        'CARTE_CINE_ILLIMITE',
        'CARTE_CINE_MULTISEANCES',
        'CINE_PLEIN_AIR',
        'CINE_VENTE_DISTANCE',
        'EVENEMENT_CINE',
        'FESTIVAL_CINE',
        'SEANCE_CINE',
      ],
    })
  })
})
