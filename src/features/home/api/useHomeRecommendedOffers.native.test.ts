import mockdate from 'mockdate'
import { UseQueryResult } from 'react-query'

import { PlaylistResponse } from 'api/gen'
import * as algoliaRecommendedOffersAPI from 'features/home/api/useAlgoliaRecommendedOffers'
import {
  getRecommendationParameters,
  useHomeRecommendedOffers,
} from 'features/home/api/useHomeRecommendedOffers'
import { RecommendedOffersModule, RecommendedOffersParameters } from 'features/home/types'
import * as recommendedIdsAPI from 'libs/recommendation/useHomeRecommendedIdsQuery'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { renderHook } from 'tests/utils'

const position = {
  latitude: 6,
  longitude: 22,
}
const mockModuleId = 'abcd'
mockdate.set(new Date('2022-11-25T00:00+00:00'))

jest.mock('libs/subcategories/useSubcategories')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('useHomeRecommendedOffers', () => {
  it('should call algolia hook', () => {
    jest
      .spyOn(recommendedIdsAPI, 'useHomeRecommendedIdsQuery')
      .mockReturnValueOnce({ data: { playlistRecommendedOffers: ['1234'] } } as UseQueryResult<
        PlaylistResponse,
        unknown
      >)

    const algoliaSpy = jest
      .spyOn(algoliaRecommendedOffersAPI, 'useAlgoliaRecommendedOffers')
      .mockImplementationOnce(jest.fn())

    renderHook(() => useHomeRecommendedOffers(position, mockModuleId))

    expect(algoliaSpy).toHaveBeenCalledWith(['1234'], 'abcd', true)
  })
})

jest.mock('libs/firebase/analytics/analytics')

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
      endDate: '2022-05-08T00:00+00:00',
      startDate: '2022-09-08T00:00+00:00',
      priceMax: 10,
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
