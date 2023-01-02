import mockdate from 'mockdate'
import { GeoCoordinates } from 'react-native-geolocation-service'

import * as computeBeginningAndEndingDatetimes from 'features/home/api/helpers/computeBeginningAndEndingDatetimes'
import { initialSearchState } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { SearchParametersFields } from 'libs/contentful'
import { useParseSearchParameters } from 'libs/search'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { renderHook } from 'tests/utils'

import { parseSearchParameters } from './parseSearchParameters'

jest.mock('features/profile/api/useUpdateProfileMutation')
mockdate.set(new Date('2020-10-01T00:00+00:00'))

const defaultSearchParameters = {
  ...initialSearchState,
  hitsPerPage: null,
  priceRange: [0, 300],
}

describe('parseSearchParameters', () => {
  const subcategoryLabelMapping = useSubcategoryLabelMapping()

  it('should return default parameters when no parameters are provided', () => {
    const parameters = {} as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
    expect(result).toStrictEqual(defaultSearchParameters)
  })

  it('should return parsed algolia parameters with mapped categories when provided', () => {
    const parameters = {
      categories: ['Arts & loisirs créatifs', 'Bibliothèques, Médiathèques', 'Cartes jeunes'],
    } as SearchParametersFields

    const { result } = renderHook(() => useParseSearchParameters())
    const parsedParameters = result.current(parameters)
    expect(parsedParameters).toStrictEqual({
      ...defaultSearchParameters,
      offerCategories: ['ARTS_LOISIRS_CREATIFS', 'BIBLIOTHEQUES_MEDIATHEQUE', 'CARTES_JEUNES'],
    })
  })

  it('should return parsed algolia parameters with mapped subcategories when provided', () => {
    const parameters = {
      subcategories: ['Cinéma plein air', 'Escape game', 'Festival et salon du livre'],
    } as SearchParametersFields

    const { result } = renderHook(() => useParseSearchParameters())
    const parsedParameters = result.current(parameters)
    expect(parsedParameters).toStrictEqual({
      ...defaultSearchParameters,
      offerSubcategories: ['CINE_PLEIN_AIR', 'ESCAPE_GAME', 'FESTIVAL_LIVRE'],
    })
  })

  it('should return parsed algolia parameters with tags when provided', () => {
    const parameters = {
      tags: ['offre du 14 juillet spéciale pass culture', 'offre de la pentecôte'],
      hitsPerPage: 5,
      isDuo: true,
      newestOnly: true,
      isDigital: true,
      isEvent: true,
      isThing: true,
      isFree: true,
      beginningDatetime: '2020-10-01T00:00+00:00',
      endingDatetime: '2020-10-02T00:00+00:00',
      upcomingWeekendEvent: true,
      currentWeekEvent: true,
    } as SearchParametersFields
    const geolocation = null
    const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
    expect(result).toStrictEqual({
      ...defaultSearchParameters,
      tags: ['offre du 14 juillet spéciale pass culture', 'offre de la pentecôte'],
      hitsPerPage: 5,
      offerIsDuo: true,
      offerIsNew: true,
      offerTypes: {
        isDigital: true,
        isEvent: true,
        isThing: true,
      },
      offerIsFree: true,
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
    } as SearchParametersFields
    const geolocation = null
    const mockedComputer = jest.spyOn(
      computeBeginningAndEndingDatetimes,
      'computeBeginningAndEndingDatetimes'
    )
    parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
    expect(mockedComputer).toHaveBeenCalledWith({
      beginningDatetime: undefined,
      endingDatetime: undefined,
      eventDuringNextXDays: days,
      upcomingWeekendEvent: undefined,
      currentWeekEvent: undefined,
    })
  })

  it('should return algolia parameters with isDigital when provided', () => {
    const parameters = { isDigital: true } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
    expect(result).toStrictEqual({
      ...defaultSearchParameters,
      offerTypes: { isDigital: true, isEvent: false, isThing: false },
    })
  })

  it('should return algolia parameters with isEvent when provided', () => {
    const parameters = { isEvent: true } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
    expect(result).toStrictEqual({
      ...defaultSearchParameters,
      offerTypes: { isDigital: false, isEvent: true, isThing: false },
    })
  })

  it('should return algolia parameters with isThing when provided', () => {
    const parameters = { isThing: true } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
    expect(result).toStrictEqual({
      ...defaultSearchParameters,
      offerTypes: { isDigital: false, isEvent: false, isThing: true },
    })
  })

  it('should return algolia parameters with a price range when minimum price is provided', () => {
    const parameters = { priceMin: 50 } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
    expect(result).toStrictEqual({ ...defaultSearchParameters, priceRange: [50, 300] })
  })

  it('should return algolia parameters with a price range when maximum price is provided', () => {
    const parameters = { priceMax: 200 } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
    expect(result).toStrictEqual({ ...defaultSearchParameters, priceRange: [0, 200] })
  })

  it('should return algolia parameters with a price range when minimum and maximum prices are provided', () => {
    const parameters = { priceMin: 50, priceMax: 200 } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
    expect(result).toStrictEqual({ ...defaultSearchParameters, priceRange: [50, 200] })
  })

  describe('geolocation', () => {
    const geolocation = { latitude: 1, longitude: 2 } as GeoCoordinates

    it('should return algolia parameters with geolocation with no distance limit when isGeolocated is provided', () => {
      const parameters = { isGeolocated: true } as SearchParametersFields

      const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
      expect(result?.locationFilter).toStrictEqual({
        ...defaultSearchParameters.locationFilter,
        locationType: LocationType.AROUND_ME,
        aroundRadius: null,
      })
    })

    it('should return algolia parameters with geolocation with distance limit when isGeolocated is provided and radius as well', () => {
      const parameters = { aroundRadius: 10, isGeolocated: true } as SearchParametersFields

      const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
      expect(result?.locationFilter).toStrictEqual({
        ...defaultSearchParameters.locationFilter,
        aroundRadius: 10,
        locationType: LocationType.AROUND_ME,
      })
    })

    it('should return null when isGeolocated is true & around radius is provided but geolocation is null', () => {
      const parameters = { aroundRadius: 10, isGeolocated: true } as SearchParametersFields

      const result = parseSearchParameters(parameters, null, subcategoryLabelMapping)
      expect(result).toBeUndefined()
    })

    it('should return null when isGeolocated is false & around radius is provided', () => {
      const parameters = { aroundRadius: 10, isGeolocated: false } as SearchParametersFields

      const result = parseSearchParameters(parameters, null, subcategoryLabelMapping)
      expect(result).toBeUndefined()
    })
  })
})
