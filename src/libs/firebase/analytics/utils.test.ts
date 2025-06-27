import { endOfMonth } from 'date-fns'
import { NativeScrollEvent } from 'react-native'

import { GenreType, NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { LocationFilter, SearchState, SearchView } from 'features/search/types'
import { LocationMode } from 'libs/algolia/types'
import { buildLocationFilterParam, buildPerformSearchState, isCloseToBottom } from 'libs/analytics'
import { buildModuleDisplayedOnHomepage } from 'libs/analytics/utils'

const TODAY = new Date(2023, 0, 3)

describe('[Analytics utils]', () => {
  const nativeEventMiddle = {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 400 }, // how far did we scroll
    contentSize: { height: 1600 },
  }
  const nativeEventBottom = {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 900 },
    contentSize: { height: 1600 },
  }

  it('event should not be close to bottom', () => {
    expect(isCloseToBottom(nativeEventMiddle as unknown as NativeScrollEvent)).toBeFalsy()
  })

  it('event should be close to bottom', () => {
    expect(isCloseToBottom(nativeEventBottom as unknown as NativeScrollEvent)).toBeTruthy()
  })

  describe('should build parameters for PerformSearch log', () => {
    it('when date filter is null', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          date: null,
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchView: SearchView.Results,
      })
    })

    it('with date filter (Today)', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          beginningDatetime: TODAY.toISOString(),
          endingDatetime: undefined,
          calendarFilterId: 'today',
        },
        'SearchResults'
      )

      expect(partialSearchState).toMatchObject({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchDate: JSON.stringify({
          startDate: TODAY.toISOString(),
          endDate: null,
          searchFilter: 'today',
        }),
        searchView: SearchView.Results,
      })
    })

    it('with date filter (next month)', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          beginningDatetime: TODAY.toISOString(),
          endingDatetime: endOfMonth(TODAY).toISOString(),
          calendarFilterId: 'thisMonth',
        },
        'SearchResults'
      )

      expect(partialSearchState).toMatchObject({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchDate: JSON.stringify({
          startDate: TODAY.toISOString(),
          endDate: endOfMonth(TODAY).toISOString(),
          searchFilter: 'thisMonth',
        }),
        searchView: SearchView.Results,
      })
    })

    it('with single date selected (no filter)', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          beginningDatetime: TODAY.toISOString(),
          endingDatetime: undefined,
          calendarFilterId: undefined,
        },
        'SearchResults'
      )

      expect(partialSearchState).toMatchObject({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchDate: JSON.stringify({
          startDate: TODAY.toISOString(),
          endDate: null,
          searchFilter: null,
        }),
        searchView: SearchView.Results,
      })
    })

    it('with date range selected (no filter)', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          beginningDatetime: TODAY.toISOString(),
          endingDatetime: endOfMonth(TODAY).toISOString(),
          calendarFilterId: undefined,
        },
        'SearchResults'
      )

      expect(partialSearchState).toMatchObject({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchDate: JSON.stringify({
          startDate: TODAY.toISOString(),
          endDate: endOfMonth(TODAY).toISOString(),
          searchFilter: null,
        }),
        searchView: SearchView.Results,
      })
    })

    it('with location filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchView: SearchView.Results,
      })
    })

    it('when user press an autocomplete suggestion', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          isAutocomplete: true,
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchIsAutocomplete: true,
        searchView: SearchView.Results,
      })
    })

    it('with max price filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          maxPrice: '30',
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchMaxPrice: '30',
        searchView: SearchView.Results,
      })
    })

    it('with min price filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          minPrice: '10',
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchMinPrice: '10',
        searchView: SearchView.Results,
      })
    })

    it('with an empty array of category filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          offerCategories: [],
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchView: SearchView.Results,
      })
    })

    it('with a category filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          offerCategories: [SearchGroupNameEnumv2.CINEMA],
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchCategories: JSON.stringify([SearchGroupNameEnumv2.CINEMA]),
        searchView: SearchView.Results,
      })
    })

    it('with an empty array of genre/types filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          offerGenreTypes: [],
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchView: SearchView.Results,
      })
    })

    it('with a genre/types filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          offerGenreTypes: [{ key: GenreType.MUSIC, name: 'Pop', value: 'Pop' }],
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchGenreTypes: JSON.stringify([{ key: GenreType.MUSIC, name: 'Pop', value: 'Pop' }]),
        searchView: SearchView.Results,
      })
    })

    it('with duo offer filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          offerIsDuo: true,
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchOfferIsDuo: true,
        searchView: SearchView.Results,
      })
    })

    it('with free offer filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          offerIsFree: true,
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchOfferIsFree: true,
        searchView: SearchView.Results,
      })
    })

    it('with an empty array of native category filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          offerNativeCategories: [],
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchView: SearchView.Results,
      })
    })

    it('with a native category filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          offerNativeCategories: [NativeCategoryIdEnumv2.CD],
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchNativeCategories: JSON.stringify([NativeCategoryIdEnumv2.CD]),
        searchView: SearchView.Results,
      })
    })

    it('with an empty query', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          query: '',
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchView: SearchView.Results,
      })
    })

    it('with a query', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          query: 'angele',
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchQuery: 'angele',
        searchView: SearchView.Results,
      })
    })

    it('when time range is null', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          timeRange: null,
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchView: SearchView.Results,
      })
    })

    it('with time range filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          timeRange: [18, 22],
          calendarFilterId: 'thisWeekend',
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchDate: JSON.stringify({ startDate: 18, endDate: 22, searchFilter: 'thisWeekend' }),
        searchView: SearchView.Results,
      })
    })

    it('when user press an history item', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          isFromHistory: true,
        },
        'SearchResults'
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchIsBasedOnHistory: true,
        searchView: SearchView.Results,
      })
    })
  })

  describe('should build parameters for ModuleDisplayedOnHomepage log', () => {
    const ids = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
    ]

    it('should return an empty object when no offers or venues are provided', () => {
      const result = buildModuleDisplayedOnHomepage(10)

      expect(result).toEqual({})
    })

    it('should build module state for offers when only offers are provided', () => {
      const offers = ids
      const result = buildModuleDisplayedOnHomepage(10, offers)

      expect(result).toEqual({
        offers_1_10: '1,2,3,4,5,6,7,8,9,10',
        offers_11_20: '11,12,13,14,15,16,17',
      })
    })

    it('should build module state for venues when only venues are provided', () => {
      const venues = ids
      const result = buildModuleDisplayedOnHomepage(10, undefined, venues)

      expect(result).toEqual({
        venues_1_10: '1,2,3,4,5,6,7,8,9,10',
        venues_11_20: '11,12,13,14,15,16,17',
      })
    })

    it('should build module state for both offers and venues when both are provided', () => {
      const offers = ids
      const venues = ids
      const result = buildModuleDisplayedOnHomepage(10, offers, venues)

      expect(result).toEqual({
        offers_1_10: '1,2,3,4,5,6,7,8,9,10',
        offers_11_20: '11,12,13,14,15,16,17',
        venues_1_10: '1,2,3,4,5,6,7,8,9,10',
        venues_11_20: '11,12,13,14,15,16,17',
      })
    })

    it('should handle empty arrays correctly', () => {
      const result = buildModuleDisplayedOnHomepage(10, [], [])

      expect(result).toEqual({})
    })

    it('should handle undefined arrays correctly', () => {
      const result = buildModuleDisplayedOnHomepage(10, undefined, undefined)

      expect(result).toEqual({})
    })
  })

  describe('buildLocationFilterParam', () => {
    it('should return all location filter param in a string when type is EVERYWHERE', () => {
      const everywhereType: LocationFilter = {
        locationType: LocationMode.EVERYWHERE,
      }
      const everywhereTypeSearchState: SearchState = {
        ...initialSearchState,
        locationFilter: everywhereType,
      }
      const locationFilterParam = buildLocationFilterParam(everywhereTypeSearchState)

      expect(locationFilterParam).toEqual(JSON.stringify(everywhereType))
    })

    it('should return all location filter param in a string when type is AROUND_ME', () => {
      const aroundMeType: LocationFilter = {
        locationType: LocationMode.AROUND_ME,
        aroundRadius: 100,
      }
      const aroundMeTypeSearchState: SearchState = {
        ...initialSearchState,
        locationFilter: aroundMeType,
      }
      const locationFilterParam = buildLocationFilterParam(aroundMeTypeSearchState)

      expect(locationFilterParam).toEqual(JSON.stringify(aroundMeType))
    })

    it('should return location type and the name of the venue in a string when type is VENUE', () => {
      const venueTypeSearchState: SearchState = {
        ...initialSearchState,
        venue: {
          label: 'Accor Arena',
          info: 'Salle de spectacle, Paris',
          venueId: 1,
          isOpenToPublic: true,
        },
      }
      const locationFilterParam = buildLocationFilterParam(venueTypeSearchState)

      expect(locationFilterParam).toEqual(
        JSON.stringify({ locationType: 'VENUE', label: 'Accor Arena' })
      )
    })

    it('should return location type and the truncated name of the venue in a string when type is VENUE', () => {
      const venueTypeSearchState: SearchState = {
        ...initialSearchState,
        venue: {
          label: 'Accor Arena, la MEILLEURE salle de France avec une acoustique incroyable',
          info: 'Salle de spectacle, Paris',
          venueId: 1,
          isOpenToPublic: true,
        },
      }
      const locationFilterParam = buildLocationFilterParam(venueTypeSearchState)

      expect(locationFilterParam).toEqual(
        JSON.stringify({
          locationType: 'VENUE',
          label: 'Accor Arena, la MEILLEURE salle de France avec une acoustique inc',
        })
      )
    })

    it('should return location type and the name of the place in a string when type is PLACE', () => {
      const placeType: LocationFilter = {
        locationType: LocationMode.AROUND_PLACE,
        place: {
          label: 'Rue de la Paix, Paris',
          info: 'Paris',
          type: 'street',
          geolocation: { longitude: 2.331196, latitude: 48.869334 },
        },
        aroundRadius: 100,
      }
      const placeTypeSearchState = {
        ...initialSearchState,
        locationFilter: placeType,
      }
      const locationFilterParam = buildLocationFilterParam(placeTypeSearchState)

      expect(locationFilterParam).toEqual(
        JSON.stringify({ locationType: 'PLACE', label: 'Rue de la Paix, Paris' })
      )
    })

    it('should return location type and the truncated name of the place in a string when type is PLACE', () => {
      const placeType: LocationFilter = {
        locationType: LocationMode.AROUND_PLACE,
        place: {
          label: 'Rue de la Paix, Reconnaissance, Passion, Envie, Motivation et Intérêt, Paris',
          info: 'Paris',
          type: 'street',
          geolocation: { longitude: 2.331196, latitude: 48.869334 },
        },
        aroundRadius: 100,
      }
      const placeTypeSearchState = {
        ...initialSearchState,
        locationFilter: placeType,
      }
      const locationFilterParam = buildLocationFilterParam(placeTypeSearchState)

      expect(locationFilterParam).toEqual(
        JSON.stringify({
          locationType: 'PLACE',
          label: 'Rue de la Paix, Reconnaissance, Passion, Envie, Motivation et Int',
        })
      )
    })
  })
})
