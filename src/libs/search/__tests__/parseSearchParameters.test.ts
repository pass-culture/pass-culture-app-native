import { GeoCoordinates } from 'react-native-geolocation-service'

import { SearchParametersFields } from 'features/home/contentful'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { useParseSearchParameters } from 'libs/search'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { renderHook } from 'tests/utils'

import { parseSearchParameters } from '../parseSearchParameters'

jest.mock('features/profile/api')

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
    } as SearchParametersFields
    const geolocation = null
    const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
    expect(result).toStrictEqual({
      ...defaultSearchParameters,
      tags: ['offre du 14 juillet spéciale pass culture', 'offre de la pentecôte'],
    })
  })

  it('should return parsed algolia parameters with hitsPerPage when provided', () => {
    const parameters = { hitsPerPage: 5 } as SearchParametersFields
    const geolocation = null
    const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
    expect(result).toStrictEqual({ ...defaultSearchParameters, hitsPerPage: 5 })
  })

  it('should return parsed algolia parameters with isDuo when provided', () => {
    const parameters = { isDuo: true } as SearchParametersFields
    const geolocation = null
    const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
    expect(result).toStrictEqual({ ...defaultSearchParameters, offerIsDuo: true })
  })

  it('should return algolia parameters with newestOnly when provided', () => {
    const parameters = { newestOnly: true } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
    expect(result).toStrictEqual({ ...defaultSearchParameters, offerIsNew: true })
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

  it('should return algolia parameters with all offer types when provided', () => {
    const parameters = { isDigital: true, isEvent: true, isThing: true } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
    expect(result).toStrictEqual({
      ...defaultSearchParameters,
      offerTypes: { isDigital: true, isEvent: true, isThing: true },
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

  it('should return algolia parameters with isFree when provided', () => {
    const parameters = { isFree: true } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
    expect(result).toStrictEqual({ ...defaultSearchParameters, offerIsFree: true })
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

  describe('beginningDatetime & endingDatetime', () => {
    it('should return algolia parameters with a beginning date when provided', () => {
      const beginningDatetime = new Date(2020, 9, 1, 22, 0, 0).toISOString()
      const beginningDatetimeAsString = '2020-10-01T22:00:00'
      const parameters = { beginningDatetime: beginningDatetimeAsString } as SearchParametersFields
      const geolocation = null

      const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
      expect(result).toStrictEqual({ ...defaultSearchParameters, beginningDatetime })
    })

    it('should return algolia parameters with an ending date when provided', () => {
      const endingDatetime = new Date(2020, 9, 1, 22, 0, 0).toISOString()
      const endingDatetimeAsString = '2020-10-01T22:00:00'
      const parameters = { endingDatetime: endingDatetimeAsString } as SearchParametersFields
      const geolocation = null

      const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
      expect(result).toStrictEqual({ ...defaultSearchParameters, endingDatetime })
    })

    it('should return algolia parameters with a beginning date and an ending date when provided', () => {
      const beginningDatetime = new Date(2020, 9, 1, 0, 0, 0).toISOString()
      const endingDatetime = new Date(2020, 9, 2, 0, 0, 0).toISOString()
      const beginningDatetimeAsString = '2020-10-01T00:00:00'
      const endingDatetimeAsString = '2020-10-02T00:00:00'
      const parameters = {
        beginningDatetime: beginningDatetimeAsString,
        endingDatetime: endingDatetimeAsString,
      } as SearchParametersFields
      const geolocation = null

      const result = parseSearchParameters(parameters, geolocation, subcategoryLabelMapping)
      expect(result).toStrictEqual({
        ...defaultSearchParameters,
        beginningDatetime,
        endingDatetime,
      })
    })
  })
})
