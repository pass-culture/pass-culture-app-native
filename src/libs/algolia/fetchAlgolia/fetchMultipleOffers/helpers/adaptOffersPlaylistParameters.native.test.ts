import { omit } from 'lodash'
import mockdate from 'mockdate'

import * as computeBeginningAndEndingDatetimes from 'features/home/api/helpers/computeBeginningAndEndingDatetimes'
import { OffersModuleParameters } from 'features/home/types'
import { initialSearchState } from 'features/search/context/reducer'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { useGenreTypeMapping, useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { renderHook } from 'tests/utils'

import { adaptOffersPlaylistParameters } from './adaptOffersPlaylistParameters'

jest.mock('libs/subcategories/useSubcategories')

jest.mock('queries/profile/usePatchProfileMutation')
mockdate.set(new Date('2020-10-01T00:00+00:00'))

const defaultSearchParameters = omit(
  {
    ...initialSearchState,
    hitsPerPage: null,
    priceRange: [0, 300],
    minBookingsThreshold: 0,
    offerGenreTypes: [],
    offerGtlLabel: undefined,
    offerGtlLevel: undefined,
    allocineIdList: [],
  },
  [
    'offerIsFree',
    'view',
    'venue',
    'locationFilter',
    'gtls',
    'minPrice',
    'maxPrice',
    'defaultMaxPrice',
    'defaultMinPrice',
  ]
)

jest.mock('libs/firebase/analytics/analytics')

describe('adaptOffersPlaylistParameters', () => {
  const {
    result: { current: subcategoryLabelMapping },
  } = renderHook(useSubcategoryLabelMapping)
  const {
    result: { current: genreTypeMapping },
  } = renderHook(useGenreTypeMapping)

  it('should return default parameters when no parameters are provided', () => {
    const parameters = {} as OffersModuleParameters

    const result = adaptOffersPlaylistParameters(
      parameters,
      subcategoryLabelMapping,
      genreTypeMapping
    )

    expect(result).toStrictEqual(defaultSearchParameters)
  })

  it('should return parsed algolia parameters with mapped categories when provided', () => {
    const parameters = {
      categories: ['Arts & loisirs créatifs', 'Cartes jeunes'],
    } as OffersModuleParameters

    const { result } = renderHook(() => useAdaptOffersPlaylistParameters())
    const parsedParameters = result.current(parameters).offerParams

    expect(parsedParameters).toStrictEqual({
      ...defaultSearchParameters,
      offerCategories: ['ARTS_LOISIRS_CREATIFS', 'CARTES_JEUNES'],
    })
  })

  it('should return parsed algolia parameters with mapped subcategories when provided', () => {
    const parameters = {
      subcategories: ['Cinéma plein air', 'Escape game', 'Festival et salon du livre'],
    } as OffersModuleParameters

    const { result } = renderHook(() => useAdaptOffersPlaylistParameters())
    const parsedParameters = result.current(parameters).offerParams

    expect(parsedParameters).toStrictEqual({
      ...defaultSearchParameters,
      offerSubcategories: ['CINE_PLEIN_AIR', 'ESCAPE_GAME', 'FESTIVAL_LIVRE'],
    })
  })

  it('should return parsed algolia parameters with tags when provided', () => {
    const parameters = {
      title: 'title',
      tags: ['offre du 14 juillet spéciale pass culture', 'offre de la pentecôte'],
      hitsPerPage: 5,
      isDuo: true,
      newestOnly: true,
      isDigital: true,
      isEvent: true,
      isThing: true,
      beginningDatetime: '2020-10-01T00:00+00:00',
      endingDatetime: '2020-10-02T00:00+00:00',
      upcomingWeekendEvent: true,
      currentWeekEvent: true,
    } as OffersModuleParameters
    const result = adaptOffersPlaylistParameters(
      parameters,
      subcategoryLabelMapping,
      genreTypeMapping
    )

    expect(result).toStrictEqual({
      ...defaultSearchParameters,
      tags: ['offre du 14 juillet spéciale pass culture', 'offre de la pentecôte'],
      hitsPerPage: 5,
      offerIsDuo: true,
      isDigital: true,
      beginningDatetime: '2020-10-01T00:00+00:00',
      endingDatetime: '2020-10-02T00:00+00:00',
    })
  })

  it('should return parsed algolia parameters with event during 5 days when provided', () => {
    const days = 5
    const parameters = {
      tags: ['offre du 14 juillet spéciale pass culture', 'offre de la pentecôte'],
      hitsPerPage: 5,
      eventDuringNextXDays: days,
    } as OffersModuleParameters
    const mockedComputer = jest.spyOn(
      computeBeginningAndEndingDatetimes,
      'computeBeginningAndEndingDatetimes'
    )
    adaptOffersPlaylistParameters(parameters, subcategoryLabelMapping, genreTypeMapping)

    expect(mockedComputer).toHaveBeenCalledWith({
      beginningDatetime: undefined,
      endingDatetime: undefined,
      eventDuringNextXDays: days,
      upcomingWeekendEvent: undefined,
      currentWeekEvent: undefined,
    })
  })

  it('should return algolia parameters with isDigital when provided', () => {
    const parameters = { isDigital: true } as OffersModuleParameters

    const result = adaptOffersPlaylistParameters(
      parameters,
      subcategoryLabelMapping,
      genreTypeMapping
    )

    expect(result).toStrictEqual({
      ...defaultSearchParameters,
      isDigital: true,
    })
  })

  it('should return algolia parameters with a price range when minimum price is provided', () => {
    const parameters = { priceMin: 50 } as OffersModuleParameters

    const result = adaptOffersPlaylistParameters(
      parameters,
      subcategoryLabelMapping,
      genreTypeMapping
    )

    expect(result).toStrictEqual({ ...defaultSearchParameters, priceRange: [50, 300] })
  })

  it('should return algolia parameters with a price range when maximum price is provided', () => {
    const parameters = { priceMax: 200 } as OffersModuleParameters

    const result = adaptOffersPlaylistParameters(
      parameters,
      subcategoryLabelMapping,
      genreTypeMapping
    )

    expect(result).toStrictEqual({ ...defaultSearchParameters, priceRange: [0, 200] })
  })

  it('should return algolia parameters with a price range when minimum and maximum prices are provided', () => {
    const parameters = { priceMin: 50, priceMax: 200 } as OffersModuleParameters

    const result = adaptOffersPlaylistParameters(
      parameters,
      subcategoryLabelMapping,
      genreTypeMapping
    )

    expect(result).toStrictEqual({ ...defaultSearchParameters, priceRange: [50, 200] })
  })

  it('should return algolia parameters when a movieGenres and a musicTypes lists are provided', () => {
    const parameters = {
      movieGenres: ['Bollywood'],
      musicTypes: ['Rock'],
    } as OffersModuleParameters

    const result = adaptOffersPlaylistParameters(
      parameters,
      subcategoryLabelMapping,
      genreTypeMapping
    )

    expect(result).toStrictEqual({
      ...defaultSearchParameters,
      offerGenreTypes: [
        { key: 'MOVIE', name: 'BOLLYWOOD', value: 'Bollywood' },
        { key: 'MUSIC', name: 'ROCK', value: 'Rock' },
      ],
    })
  })

  it('should return algolia parameters when minimum likes number provided', () => {
    const parameters = {
      likesMin: 200,
    } as OffersModuleParameters

    const result = adaptOffersPlaylistParameters(
      parameters,
      subcategoryLabelMapping,
      genreTypeMapping
    )

    expect(result).toStrictEqual({
      ...defaultSearchParameters,
      minLikes: 200,
    })
  })
})
