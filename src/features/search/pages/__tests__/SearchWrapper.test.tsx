import React from 'react'
import { View } from 'react-native'

import { DATE_FILTER_OPTIONS, LocationType } from 'features/search/enums'
import { RecursivePartial, SearchState } from 'features/search/types'
import { render } from 'tests/utils'

import {
  SearchWrapper,
  sanitizeSearchStateParams,
  searchRouteParamsToSearchState,
} from '../SearchWrapper'

jest.mock('libs/geolocation', () => ({
  useGeolocation: jest.fn(() => ({ latitude: 2, longitude: 40 })),
}))

describe('<SearchWrapper />', () => {
  describe('Search component', () => {
    it('should render correctly', () => {
      const { toJSON } = render(<View />, { wrapper: SearchWrapper })
      expect(toJSON()).toMatchSnapshot()
    })
  })

  describe('Search navigation utilities', () => {
    it('should sanitizeSearchStateParams', () => {
      const searchState: RecursivePartial<SearchState> = {
        aroundRadius: 100,
        beginningDatetime: new Date('2021-08-10T15:02:01.100Z'),
        date: {
          option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
          selectedDate: new Date('2021-08-10T15:02:01.100Z'),
        },
        endingDatetime: new Date('2021-08-10T15:02:01.100Z'),
        geolocation: {
          latitude: 48.891304999999996,
          longitude: 2.3529866999999998,
        },
        hitsPerPage: 20,
        // this locationType is default, it is removed as it will be re-applied in the reducer
        locationType: LocationType.EVERYWHERE,
        offerIsDuo: false,
        offerIsFree: false,
        offerIsNew: true,
        offerTypes: {
          isDigital: false,
          isThing: true,
        },
        place: {
          name: {
            long: 'Rue Victor Hugo, Bordeaux',
            short: 'Rue Victor Hugo',
          },
          extraData: {
            city: 'Bordeaux',
            department: 'Gironde',
          },
          geolocation: {
            longitude: -0.609124,
            latitude: 44.846721,
          },
        },
        priceRange: [100, 300],
        showResults: false,
        tags: ['tag1'],
        timeRange: [10, 24],
        venueId: 456445,
      }

      expect(sanitizeSearchStateParams(searchState)).toEqual({
        aroundRadius: 100,
        beginningDatetime: new Date('2021-08-10T15:02:01.100Z'),
        date: {
          option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
          selectedDate: new Date('2021-08-10T15:02:01.100Z'),
        },
        endingDatetime: new Date('2021-08-10T15:02:01.100Z'),
        geolocation: {
          latitude: 48.891304999999996,
          longitude: 2.3529866999999998,
        },
        hitsPerPage: 20,
        // add an empty array when no offerCategories is passed
        offerCategories: [],
        offerIsNew: true,
        offerTypes: {
          isThing: true,
        },
        place: {
          name: {
            long: 'Rue Victor Hugo, Bordeaux',
            short: 'Rue Victor Hugo',
          },
          extraData: {
            city: 'Bordeaux',
            department: 'Gironde',
          },
          geolocation: {
            longitude: -0.609124,
            latitude: 44.846721,
          },
        },
        priceRange: [100, 300],
        // add an empty string when no string is passed
        query: '',
        tags: ['tag1'],
        timeRange: [10, 24],
        venueId: 456445,
      })
    })

    it('should searchRouteParamsToSearchState', () => {
      expect(
        searchRouteParamsToSearchState({
          aroundRadius: 100,
          beginningDatetime: new Date('2021-08-10T15:02:01.100Z'),
          date: {
            option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
            selectedDate: new Date('2021-08-10T15:02:01.100Z'),
          },
          endingDatetime: new Date('2021-08-10T15:02:01.100Z'),
          geolocation: {
            latitude: 48.891304999999996,
            longitude: 2.3529866999999998,
          },
          hitsPerPage: 20,
          offerCategories: [],
          offerIsNew: true,
          offerTypes: {
            isThing: true,
          },
          place: {
            name: {
              long: 'Rue Victor Hugo, Bordeaux',
              short: 'Rue Victor Hugo',
            },
            extraData: {
              city: 'Bordeaux',
              department: 'Gironde',
            },
            geolocation: {
              longitude: -0.609124,
              latitude: 44.846721,
            },
          },
          priceRange: [100, 300],
          query: '',
          tags: ['tag1'],
          timeRange: [10, 24],
          venueId: 456445,
        })
      ).toEqual({
        aroundRadius: 100,
        beginningDatetime: new Date('2021-08-10T15:02:01.100Z'),
        date: {
          option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
          selectedDate: new Date('2021-08-10T15:02:01.100Z'),
        },
        endingDatetime: new Date('2021-08-10T15:02:01.100Z'),
        geolocation: { latitude: 48.891304999999996, longitude: 2.3529866999999998 },
        hitsPerPage: 20,
        locationType: 'EVERYWHERE',
        offerCategories: [],
        offerIsDuo: false,
        offerIsFree: false,
        offerIsNew: true,
        offerTypes: { isDigital: false, isEvent: false, isThing: true },
        place: {
          name: { long: 'Rue Victor Hugo, Bordeaux', short: 'Rue Victor Hugo' },
          extraData: { city: 'Bordeaux', department: 'Gironde' },
          geolocation: { longitude: -0.609124, latitude: 44.846721 },
        },
        priceRange: [100, 300],
        query: '',
        showResults: false,
        tags: ['tag1'],
        timeRange: [10, 24],
        venueId: 456445,
      })
    })
  })
})
