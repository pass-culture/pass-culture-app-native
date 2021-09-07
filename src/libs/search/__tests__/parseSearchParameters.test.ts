import { GeoCoordinates } from 'react-native-geolocation-service'

import { SearchParametersFields } from 'features/home/contentful'
import { CATEGORY_CRITERIA, LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'

import { parseSearchParameters } from '../parseSearchParameters'

const availableCategories = CATEGORY_CRITERIA

const defaultSearchParameters = {
  ...initialSearchState,
  hitsPerPage: null,
  priceRange: [0, 300],
}

describe('src | components | parseSearchParameters', () => {
  it('should return default parameters when no parameters are provided', () => {
    const parameters = {} as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, availableCategories)
    expect(result).toStrictEqual(defaultSearchParameters)
  })

  it('should return parsed algolia parameters with mapped categories when provided', () => {
    const parameters = {
      categories: ['Cinéma', 'Cours, ateliers', 'Livres'],
    } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, availableCategories)
    expect(result).toStrictEqual({
      ...defaultSearchParameters,
      offerCategories: ['CINEMA', 'LECON', 'LIVRE'],
    })
  })

  it('should return parsed algolia parameters with tags when provided', () => {
    const parameters = {
      tags: ['offre du 14 juillet spéciale pass culture', 'offre de la pentecôte'],
    } as SearchParametersFields
    const geolocation = null
    const result = parseSearchParameters(parameters, geolocation, availableCategories)
    expect(result).toStrictEqual({
      ...defaultSearchParameters,
      tags: ['offre du 14 juillet spéciale pass culture', 'offre de la pentecôte'],
    })
  })

  it('should return parsed algolia parameters with hitsPerPage when provided', () => {
    const parameters = { hitsPerPage: 5 } as SearchParametersFields
    const geolocation = null
    const result = parseSearchParameters(parameters, geolocation, availableCategories)
    expect(result).toStrictEqual({ ...defaultSearchParameters, hitsPerPage: 5 })
  })

  it('should return parsed algolia parameters with isDuo when provided', () => {
    const parameters = { isDuo: true } as SearchParametersFields
    const geolocation = null
    const result = parseSearchParameters(parameters, geolocation, availableCategories)
    expect(result).toStrictEqual({ ...defaultSearchParameters, offerIsDuo: true })
  })

  it('should return algolia parameters with newestOnly when provided', () => {
    const parameters = { newestOnly: true } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, availableCategories)
    expect(result).toStrictEqual({ ...defaultSearchParameters, offerIsNew: true })
  })

  it('should return algolia parameters with isDigital when provided', () => {
    const parameters = { isDigital: true } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, availableCategories)
    expect(result).toStrictEqual({
      ...defaultSearchParameters,
      offerTypes: { isDigital: true, isEvent: false, isThing: false },
    })
  })

  it('should return algolia parameters with isEvent when provided', () => {
    const parameters = { isEvent: true } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, availableCategories)
    expect(result).toStrictEqual({
      ...defaultSearchParameters,
      offerTypes: { isDigital: false, isEvent: true, isThing: false },
    })
  })

  it('should return algolia parameters with isThing when provided', () => {
    const parameters = { isThing: true } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, availableCategories)
    expect(result).toStrictEqual({
      ...defaultSearchParameters,
      offerTypes: { isDigital: false, isEvent: false, isThing: true },
    })
  })

  it('should return algolia parameters with all offer types when provided', () => {
    const parameters = { isDigital: true, isEvent: true, isThing: true } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, availableCategories)
    expect(result).toStrictEqual({
      ...defaultSearchParameters,
      offerTypes: { isDigital: true, isEvent: true, isThing: true },
    })
  })

  it('should return algolia parameters with a price range when minimum price is provided', () => {
    const parameters = { priceMin: 50 } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, availableCategories)
    expect(result).toStrictEqual({ ...defaultSearchParameters, priceRange: [50, 300] })
  })

  it('should return algolia parameters with a price range when maximum price is provided', () => {
    const parameters = { priceMax: 200 } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, availableCategories)
    expect(result).toStrictEqual({ ...defaultSearchParameters, priceRange: [0, 200] })
  })

  it('should return algolia parameters with a price range when minimum and maximum prices are provided', () => {
    const parameters = { priceMin: 50, priceMax: 200 } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, availableCategories)
    expect(result).toStrictEqual({ ...defaultSearchParameters, priceRange: [50, 200] })
  })

  it('should return algolia parameters with isFree when provided', () => {
    const parameters = { isFree: true } as SearchParametersFields
    const geolocation = null

    const result = parseSearchParameters(parameters, geolocation, availableCategories)
    expect(result).toStrictEqual({ ...defaultSearchParameters, offerIsFree: true })
  })

  describe('geolocation', () => {
    const geolocation = {
      latitude: 1,
      longitude: 2,
    } as GeoCoordinates

    it('should return algolia parameters with geolocation with no distance limit when isGeolocated is provided', () => {
      const parameters = { isGeolocated: true } as SearchParametersFields

      const result = parseSearchParameters(parameters, geolocation, availableCategories)
      expect(result).toStrictEqual({
        ...defaultSearchParameters,
        geolocation,
        locationType: LocationType.AROUND_ME,
      })
    })

    it('should return algolia parameters with geolocation with distance limit when isGeolocated is provided and radius as well', () => {
      const parameters = { aroundRadius: 10, isGeolocated: true } as SearchParametersFields

      const result = parseSearchParameters(parameters, geolocation, availableCategories)
      expect(result).toStrictEqual({
        ...defaultSearchParameters,
        aroundRadius: 10,
        geolocation,
        locationType: LocationType.AROUND_ME,
      })
    })

    it('should return null when isGeolocated is true & around radius is provided but geolocation is null', () => {
      const parameters = { aroundRadius: 10, isGeolocated: true } as SearchParametersFields

      const result = parseSearchParameters(parameters, null, availableCategories)
      expect(result).toBeUndefined()
    })

    it('should return null when isGeolocated is false & around radius is provided', () => {
      const parameters = { aroundRadius: 10, isGeolocated: false } as SearchParametersFields

      const result = parseSearchParameters(parameters, null, availableCategories)
      expect(result).toBeUndefined()
    })
  })

  describe('beginningDatetime & endingDatetime', () => {
    it('should return algolia parameters with a beginning date when provided', () => {
      const beginningDatetime = new Date(2020, 9, 1, 22, 0, 0)
      const beginningDatetimeAsString = '2020-10-01T22:00:00'
      const parameters = { beginningDatetime: beginningDatetimeAsString } as SearchParametersFields
      const geolocation = null

      const result = parseSearchParameters(parameters, geolocation, availableCategories)
      expect(result).toStrictEqual({ ...defaultSearchParameters, beginningDatetime })
    })

    it('should return algolia parameters with an ending date when provided', () => {
      const endingDatetime = new Date(2020, 9, 1, 22, 0, 0)
      const endingDatetimeAsString = '2020-10-01T22:00:00'
      const parameters = { endingDatetime: endingDatetimeAsString } as SearchParametersFields
      const geolocation = null

      const result = parseSearchParameters(parameters, geolocation, availableCategories)
      expect(result).toStrictEqual({ ...defaultSearchParameters, endingDatetime })
    })

    it('should return algolia parameters with a begginnig date and an ending date when provided', () => {
      const beginningDatetime = new Date(2020, 9, 1, 0, 0, 0)
      const endingDatetime = new Date(2020, 9, 2, 0, 0, 0)
      const beginningDatetimeAsString = '2020-10-01T00:00:00'
      const endingDatetimeAsString = '2020-10-02T00:00:00'
      const parameters = {
        beginningDatetime: beginningDatetimeAsString,
        endingDatetime: endingDatetimeAsString,
      } as SearchParametersFields
      const geolocation = null

      const result = parseSearchParameters(parameters, geolocation, availableCategories)
      expect(result).toStrictEqual({
        ...defaultSearchParameters,
        beginningDatetime,
        endingDatetime,
      })
    })
  })
})
