import { GeoCoordinates } from 'react-native-geolocation-service'

import { AlgoliaParametersFields } from 'features/home/contentful'
import { parseAlgoliaParameters } from 'libs/algolia'

import { LocationType } from '../types'

describe('src | components | parseAlgoliaParameters', () => {
  it('should return default parameters when no parameters are provided', () => {
    // given
    const parameters = {} as AlgoliaParametersFields
    const geolocation = null
    // when
    const result = parseAlgoliaParameters({ geolocation, parameters })

    // then
    expect(result).toStrictEqual({
      aroundRadius: null,
      beginningDatetime: null,
      endingDatetime: null,
      geolocation,
      hitsPerPage: null,
      offerCategories: [],
      offerIsDuo: false,
      offerIsFree: false,
      offerIsNew: false,
      offerTypes: { isDigital: false, isEvent: false, isThing: false },
      priceRange: [0, 500],
      locationType: LocationType.EVERYWHERE,
      tags: [],
    })
  })

  it('should return parsed algolia parameters with mapped categories when provided', () => {
    // given
    const parameters = {
      categories: ['Cinéma', 'Cours, ateliers', 'Livres'],
    } as AlgoliaParametersFields
    const geolocation = null
    // when
    const result = parseAlgoliaParameters({ geolocation, parameters })

    // then
    expect(result).toStrictEqual({
      aroundRadius: null,
      beginningDatetime: null,
      endingDatetime: null,
      geolocation,
      hitsPerPage: null,
      offerCategories: ['CINEMA', 'LECON', 'LIVRE'],
      offerIsDuo: false,
      offerIsFree: false,
      offerIsNew: false,
      offerTypes: { isDigital: false, isEvent: false, isThing: false },
      priceRange: [0, 500],
      locationType: LocationType.EVERYWHERE,
      tags: [],
    })
  })

  it('should return parsed algolia parameters with tags when provided', () => {
    // given
    const parameters = {
      tags: ['offre du 14 juillet spéciale pass culture', 'offre de la pentecôte'],
    } as AlgoliaParametersFields
    const geolocation = null
    // when
    const result = parseAlgoliaParameters({ geolocation, parameters })

    // then
    expect(result).toStrictEqual({
      aroundRadius: null,
      beginningDatetime: null,
      endingDatetime: null,
      geolocation,
      hitsPerPage: null,
      offerCategories: [],
      offerIsDuo: false,
      offerIsFree: false,
      offerIsNew: false,
      offerTypes: { isDigital: false, isEvent: false, isThing: false },
      priceRange: [0, 500],
      locationType: LocationType.EVERYWHERE,
      tags: ['offre du 14 juillet spéciale pass culture', 'offre de la pentecôte'],
    })
  })

  it('should return parsed algolia parameters with hitsPerPage when provided', () => {
    // given
    const parameters = {
      hitsPerPage: 5,
    } as AlgoliaParametersFields
    const geolocation = null
    // when
    const result = parseAlgoliaParameters({ geolocation, parameters })

    // then
    expect(result).toStrictEqual({
      aroundRadius: null,
      beginningDatetime: null,
      endingDatetime: null,
      geolocation,
      hitsPerPage: 5,
      offerCategories: [],
      offerIsDuo: false,
      offerIsFree: false,
      offerIsNew: false,
      offerTypes: { isDigital: false, isEvent: false, isThing: false },
      priceRange: [0, 500],
      locationType: LocationType.EVERYWHERE,
      tags: [],
    })
  })

  it('should return parsed algolia parameters with isDuo when provided', () => {
    // given
    const parameters = {
      isDuo: true,
    } as AlgoliaParametersFields
    const geolocation = null
    // when
    const result = parseAlgoliaParameters({ geolocation, parameters })

    // then
    expect(result).toStrictEqual({
      aroundRadius: null,
      beginningDatetime: null,
      endingDatetime: null,
      geolocation,
      hitsPerPage: null,
      offerCategories: [],
      offerIsDuo: true,
      offerIsFree: false,
      offerIsNew: false,
      offerTypes: { isDigital: false, isEvent: false, isThing: false },
      priceRange: [0, 500],
      locationType: LocationType.EVERYWHERE,
      tags: [],
    })
  })

  it('should return algolia parameters with newestOnly when provided', () => {
    // given
    const parameters = {
      newestOnly: true,
    } as AlgoliaParametersFields
    const geolocation = null
    // when
    const result = parseAlgoliaParameters({ geolocation, parameters })

    // then
    expect(result).toStrictEqual({
      aroundRadius: null,
      beginningDatetime: null,
      endingDatetime: null,
      geolocation,
      hitsPerPage: null,
      offerCategories: [],
      offerIsDuo: false,
      offerIsFree: false,
      offerIsNew: true,
      offerTypes: { isDigital: false, isEvent: false, isThing: false },
      priceRange: [0, 500],
      locationType: LocationType.EVERYWHERE,
      tags: [],
    })
  })

  it('should return algolia parameters with isDigital when provided', () => {
    // given
    const parameters = {
      isDigital: true,
    } as AlgoliaParametersFields
    const geolocation = null
    // when
    const result = parseAlgoliaParameters({ geolocation, parameters })

    // then
    expect(result).toStrictEqual({
      aroundRadius: null,
      beginningDatetime: null,
      endingDatetime: null,
      geolocation,
      hitsPerPage: null,
      offerCategories: [],
      offerIsDuo: false,
      offerIsFree: false,
      offerIsNew: false,
      offerTypes: { isDigital: true, isEvent: false, isThing: false },
      priceRange: [0, 500],
      locationType: LocationType.EVERYWHERE,
      tags: [],
    })
  })

  it('should return algolia parameters with isEvent when provided', () => {
    // given
    const parameters = {
      isEvent: true,
    } as AlgoliaParametersFields
    const geolocation = null
    // when
    const result = parseAlgoliaParameters({ geolocation, parameters })

    // then
    expect(result).toStrictEqual({
      aroundRadius: null,
      beginningDatetime: null,
      endingDatetime: null,
      geolocation,
      hitsPerPage: null,
      offerCategories: [],
      offerIsDuo: false,
      offerIsFree: false,
      offerIsNew: false,
      offerTypes: { isDigital: false, isEvent: true, isThing: false },
      priceRange: [0, 500],
      locationType: LocationType.EVERYWHERE,
      tags: [],
    })
  })

  it('should return algolia parameters with isThing when provided', () => {
    // given
    const parameters = {
      isThing: true,
    } as AlgoliaParametersFields
    const geolocation = null
    // when
    const result = parseAlgoliaParameters({ geolocation, parameters })

    // then
    expect(result).toStrictEqual({
      aroundRadius: null,
      beginningDatetime: null,
      endingDatetime: null,
      geolocation,
      hitsPerPage: null,
      offerCategories: [],
      offerIsDuo: false,
      offerIsFree: false,
      offerIsNew: false,
      offerTypes: { isDigital: false, isEvent: false, isThing: true },
      priceRange: [0, 500],
      locationType: LocationType.EVERYWHERE,
      tags: [],
    })
  })

  it('should return algolia parameters with all offer types when provided', () => {
    // given
    const parameters = {
      isDigital: true,
      isEvent: true,
      isThing: true,
    } as AlgoliaParametersFields
    const geolocation = null
    // when
    const result = parseAlgoliaParameters({ geolocation, parameters })

    // then
    expect(result).toStrictEqual({
      aroundRadius: null,
      beginningDatetime: null,
      endingDatetime: null,
      geolocation,
      hitsPerPage: null,
      offerCategories: [],
      offerIsDuo: false,
      offerIsFree: false,
      offerIsNew: false,
      offerTypes: { isDigital: true, isEvent: true, isThing: true },
      priceRange: [0, 500],
      locationType: LocationType.EVERYWHERE,
      tags: [],
    })
  })

  it('should return algolia parameters with a price range when minimum price is provided', () => {
    // given
    const parameters = {
      priceMin: 50,
    } as AlgoliaParametersFields
    const geolocation = null
    // when
    const result = parseAlgoliaParameters({ geolocation, parameters })

    // then
    expect(result).toStrictEqual({
      aroundRadius: null,
      beginningDatetime: null,
      endingDatetime: null,
      geolocation,
      hitsPerPage: null,
      offerCategories: [],
      offerIsDuo: false,
      offerIsFree: false,
      offerIsNew: false,
      offerTypes: { isDigital: false, isEvent: false, isThing: false },
      priceRange: [50, 500],
      locationType: LocationType.EVERYWHERE,
      tags: [],
    })
  })

  it('should return algolia parameters with a price range when maximum price is provided', () => {
    // given
    const parameters = {
      priceMax: 300,
    } as AlgoliaParametersFields
    const geolocation = null
    // when
    const result = parseAlgoliaParameters({ geolocation, parameters })

    // then
    expect(result).toStrictEqual({
      aroundRadius: null,
      beginningDatetime: null,
      endingDatetime: null,
      geolocation,
      hitsPerPage: null,
      offerCategories: [],
      offerIsDuo: false,
      offerIsFree: false,
      offerIsNew: false,
      offerTypes: { isDigital: false, isEvent: false, isThing: false },
      priceRange: [0, 300],
      locationType: LocationType.EVERYWHERE,
      tags: [],
    })
  })

  it('should return algolia parameters with a price range when minimum and maximum prices are provided', () => {
    // given
    const parameters = {
      priceMin: 50,
      priceMax: 300,
    } as AlgoliaParametersFields
    const geolocation = null
    // when
    const result = parseAlgoliaParameters({ geolocation, parameters })

    // then
    expect(result).toStrictEqual({
      aroundRadius: null,
      beginningDatetime: null,
      endingDatetime: null,
      geolocation,
      hitsPerPage: null,
      offerCategories: [],
      offerIsDuo: false,
      offerIsFree: false,
      offerIsNew: false,
      offerTypes: { isDigital: false, isEvent: false, isThing: false },
      priceRange: [50, 300],
      locationType: LocationType.EVERYWHERE,
      tags: [],
    })
  })

  it('should return algolia parameters with isFree when provided', () => {
    // given
    const parameters = {
      isFree: true,
    } as AlgoliaParametersFields
    const geolocation = null
    // when
    const result = parseAlgoliaParameters({ geolocation, parameters })

    // then
    expect(result).toStrictEqual({
      aroundRadius: null,
      beginningDatetime: null,
      endingDatetime: null,
      geolocation,
      hitsPerPage: null,
      offerCategories: [],
      offerIsDuo: false,
      offerIsFree: true,
      offerIsNew: false,
      offerTypes: { isDigital: false, isEvent: false, isThing: false },
      priceRange: [0, 500],
      locationType: LocationType.EVERYWHERE,
      tags: [],
    })
  })

  describe('geolocation', () => {
    const geolocation = {
      latitude: 1,
      longitude: 2,
    } as GeoCoordinates

    it('should return algolia parameters with geolocation with no distance limit when isGeolocated is provided', () => {
      // given
      const parameters = {
        isGeolocated: true,
      } as AlgoliaParametersFields

      // when
      const result = parseAlgoliaParameters({ geolocation, parameters })

      // then
      expect(result).toStrictEqual({
        aroundRadius: null,
        beginningDatetime: null,
        endingDatetime: null,
        geolocation: geolocation,
        hitsPerPage: null,
        offerCategories: [],
        offerIsDuo: false,
        offerIsFree: false,
        offerIsNew: false,
        offerTypes: { isDigital: false, isEvent: false, isThing: false },
        priceRange: [0, 500],
        locationType: LocationType.AROUND_ME,
        tags: [],
      })
    })

    it('should return algolia parameters with geolocation with distance limit when isGeolocated is provided and radius as well', () => {
      // given
      const parameters = {
        aroundRadius: 10,
        isGeolocated: true,
      } as AlgoliaParametersFields

      // when
      const result = parseAlgoliaParameters({ geolocation, parameters })

      // then
      expect(result).toStrictEqual({
        aroundRadius: 10,
        beginningDatetime: null,
        endingDatetime: null,
        geolocation: geolocation,
        hitsPerPage: null,
        offerCategories: [],
        offerIsDuo: false,
        offerIsFree: false,
        offerIsNew: false,
        offerTypes: { isDigital: false, isEvent: false, isThing: false },
        priceRange: [0, 500],
        locationType: LocationType.AROUND_ME,
        tags: [],
      })
    })

    it('should return null when isGeolocated is true & around radius is provided but geolocation is null', () => {
      // given
      const parameters = {
        aroundRadius: 10,
        isGeolocated: true,
      } as AlgoliaParametersFields

      // when
      const result = parseAlgoliaParameters({
        geolocation: null,
        parameters,
      })

      // then
      expect(result).toBeNull()
    })

    it('should return null when isGeolocated is false & around radius is provided', () => {
      // given
      const parameters = {
        aroundRadius: 10,
        isGeolocated: false,
      } as AlgoliaParametersFields

      // when
      const result = parseAlgoliaParameters({
        geolocation: null,
        parameters,
      })

      // then
      expect(result).toBeNull()
    })
  })

  describe('beginningDatetime & endingDatetime', () => {
    it('should return algolia parameters with a beginning date when provided', () => {
      // given
      const beginningDatetime = new Date(2020, 9, 1, 22, 0, 0)
      const beginningDatetimeAsString = '2020-10-01T22:00:00'
      const parameters = {
        beginningDatetime: beginningDatetimeAsString,
      } as AlgoliaParametersFields
      const geolocation = null
      // when
      const result = parseAlgoliaParameters({ geolocation, parameters })

      // then
      expect(result).toStrictEqual({
        aroundRadius: null,
        beginningDatetime: beginningDatetime,
        endingDatetime: null,
        geolocation,
        hitsPerPage: null,
        offerCategories: [],
        offerIsDuo: false,
        offerIsFree: false,
        offerIsNew: false,
        offerTypes: { isDigital: false, isEvent: false, isThing: false },
        priceRange: [0, 500],
        locationType: LocationType.EVERYWHERE,
        tags: [],
      })
    })

    it('should return algolia parameters with an ending date when provided', () => {
      // given
      const endingDatetime = new Date(2020, 9, 1, 22, 0, 0)
      const endingDatetimeAsString = '2020-10-01T22:00:00'
      const parameters = {
        endingDatetime: endingDatetimeAsString,
      } as AlgoliaParametersFields
      const geolocation = null
      // when
      const result = parseAlgoliaParameters({ geolocation, parameters })

      // then
      expect(result).toStrictEqual({
        aroundRadius: null,
        beginningDatetime: null,
        endingDatetime: endingDatetime,
        geolocation,
        hitsPerPage: null,
        offerCategories: [],
        offerIsDuo: false,
        offerIsFree: false,
        offerIsNew: false,
        offerTypes: { isDigital: false, isEvent: false, isThing: false },
        priceRange: [0, 500],
        locationType: LocationType.EVERYWHERE,
        tags: [],
      })
    })

    it('should return algolia parameters with a begginnig date and an ending date when provided', () => {
      // given
      const beginningDatetime = new Date(2020, 9, 1, 0, 0, 0)
      const endingDatetime = new Date(2020, 9, 2, 0, 0, 0)
      const beginningDatetimeAsString = '2020-10-01T00:00:00'
      const endingDatetimeAsString = '2020-10-02T00:00:00'
      const parameters = {
        beginningDatetime: beginningDatetimeAsString,
        endingDatetime: endingDatetimeAsString,
      } as AlgoliaParametersFields
      const geolocation = null
      // when
      const result = parseAlgoliaParameters({ geolocation, parameters })

      // then
      expect(result).toStrictEqual({
        aroundRadius: null,
        beginningDatetime: beginningDatetime,
        endingDatetime: endingDatetime,
        geolocation,
        hitsPerPage: null,
        offerCategories: [],
        offerIsDuo: false,
        offerIsFree: false,
        offerIsNew: false,
        offerTypes: { isDigital: false, isEvent: false, isThing: false },
        priceRange: [0, 500],
        locationType: LocationType.EVERYWHERE,
        tags: [],
      })
    })
  })
})
