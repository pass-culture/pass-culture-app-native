import { NativeScrollEvent } from 'react-native'

import { GenreType, NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { SearchView } from 'features/search/types'
import { buildLocationFilterParam, buildPerformSearchState, isCloseToBottom } from 'libs/analytics'
import { LocationMode } from 'libs/location/types'

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

  const locationParams = {
    selectedLocationMode: LocationMode.EVERYWHERE,
  }
  const searchLocationFilter = JSON.stringify({ locationType: locationParams.selectedLocationMode })

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
          view: SearchView.Results,
          date: null,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchView: SearchView.Results,
      })
    })

    it('with date filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          view: SearchView.Results,
          date: { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: TODAY.toISOString() },
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchDate: JSON.stringify({
          option: DATE_FILTER_OPTIONS.TODAY,
          selectedDate: TODAY.toISOString(),
        }),
        searchView: SearchView.Results,
      })
    })

    it('with location filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchView: SearchView.Results,
      })
    })

    it('when user press an autocomplete suggestion', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          isAutocomplete: true,
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchIsAutocomplete: true,
        searchView: SearchView.Results,
      })
    })

    it('with max price filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          maxPrice: '30',
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchMaxPrice: '30',
        searchView: SearchView.Results,
      })
    })

    it('with min price filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          minPrice: '10',
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchMinPrice: '10',
        searchView: SearchView.Results,
      })
    })

    it('with an empty array of category filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          offerCategories: [],
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchView: SearchView.Results,
      })
    })

    it('with a category filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchCategories: JSON.stringify([SearchGroupNameEnumv2.FILMS_SERIES_CINEMA]),
        searchView: SearchView.Results,
      })
    })

    it('with an empty array of genre/types filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          offerGenreTypes: [],
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchView: SearchView.Results,
      })
    })

    it('with a genre/types filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          offerGenreTypes: [{ key: GenreType.MUSIC, name: 'Pop', value: 'Pop' }],
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchGenreTypes: JSON.stringify([{ key: GenreType.MUSIC, name: 'Pop', value: 'Pop' }]),
        searchView: SearchView.Results,
      })
    })

    it('with duo offer filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          offerIsDuo: true,
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchOfferIsDuo: true,
        searchView: SearchView.Results,
      })
    })

    it('with free offer filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          offerIsFree: true,
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchOfferIsFree: true,
        searchView: SearchView.Results,
      })
    })

    it('with an empty array of native category filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          offerNativeCategories: [],
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchView: SearchView.Results,
      })
    })

    it('with a native category filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          offerNativeCategories: [NativeCategoryIdEnumv2.CD],
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchNativeCategories: JSON.stringify([NativeCategoryIdEnumv2.CD]),
        searchView: SearchView.Results,
      })
    })

    it('with an empty query', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          query: '',
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchView: SearchView.Results,
      })
    })

    it('with a query', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          query: 'angele',
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchQuery: 'angele',
        searchView: SearchView.Results,
      })
    })

    it('when time range is null', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          timeRange: null,
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchView: SearchView.Results,
      })
    })

    it('with time range filter', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          timeRange: [18, 22],
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchTimeRange: JSON.stringify([18, 22]),
        searchView: SearchView.Results,
      })
    })

    it('when user press an history item', () => {
      const partialSearchState = buildPerformSearchState(
        {
          ...initialSearchState,
          isFromHistory: true,
          view: SearchView.Results,
        },
        locationParams
      )

      expect(partialSearchState).toEqual({
        searchLocationFilter,
        searchIsBasedOnHistory: true,
        searchView: SearchView.Results,
      })
    })
  })

  describe('buildLocationFilterParam', () => {
    it('should return all location filter param in a string when type is EVERYWHERE', () => {
      const everywhereType = {
        locationType: LocationMode.EVERYWHERE,
      }
      const everywhereLocationParams = {
        selectedLocationMode: LocationMode.AROUND_ME,
      }

      const locationFilterParam = buildLocationFilterParam(everywhereLocationParams)

      expect(locationFilterParam).toEqual(JSON.stringify(everywhereType))
    })

    it('should return all location filter param in a string when type is AROUND_ME', () => {
      const aroundMeType = {
        locationType: LocationMode.AROUND_ME,
        aroundRadius: 100,
      }
      const aroundMeLocationParams = {
        selectedLocationMode: LocationMode.AROUND_ME,
        aroundMeRadius: 100,
      }
      const locationFilterParam = buildLocationFilterParam(aroundMeLocationParams)

      expect(locationFilterParam).toEqual(JSON.stringify(aroundMeType))
    })

    it('should return location type and the name of the venue in a string when type is VENUE', () => {
      const venueLocationParams = {
        selectedLocationMode: LocationMode.EVERYWHERE,
        venue: {
          label: 'Accor Arena',
          info: 'Salle de spectacle, Paris',
          venueId: 1,
        },
      }
      const locationFilterParam = buildLocationFilterParam(venueLocationParams)

      expect(locationFilterParam).toEqual(
        JSON.stringify({ locationType: 'VENUE', label: 'Accor Arena' })
      )
    })

    it('should return location type and the truncated name of the venue in a string when type is VENUE', () => {
      const venueLocationParams = {
        selectedLocationMode: LocationMode.EVERYWHERE,
        venue: {
          label: 'Accor Arena, la MEILLEURE salle de France avec une acoustique incroyable',
          info: 'Salle de spectacle, Paris',
          venueId: 1,
        },
      }

      const locationFilterParam = buildLocationFilterParam(venueLocationParams)

      expect(locationFilterParam).toEqual(
        JSON.stringify({
          locationType: 'VENUE',
          label: 'Accor Arena, la MEILLEURE salle de France avec une acoustique inc',
        })
      )
    })

    it('should return location type and the name of the place in a string when type is PLACE', () => {
      const placeLocationParams = {
        selectedLocationMode: LocationMode.AROUND_PLACE,
        place: {
          label: 'Rue de la Paix, Paris',
          info: 'Paris',
          geolocation: { longitude: 2.331196, latitude: 48.869334 },
        },
        aroundMeRadius: 100,
      }
      const locationFilterParam = buildLocationFilterParam(placeLocationParams)

      expect(locationFilterParam).toEqual(
        JSON.stringify({ locationType: 'PLACE', label: 'Rue de la Paix, Paris' })
      )
    })

    it('should return location type and the truncated name of the place in a string when type is PLACE', () => {
      const placeLocationParams = {
        selectedLocationMode: LocationMode.AROUND_PLACE,
        place: {
          label: 'Rue de la Paix, Reconnaissance, Passion, Envie, Motivation et Intérêt, Paris',
          info: 'Paris',
          geolocation: { longitude: 2.331196, latitude: 48.869334 },
        },
        aroundMeRadius: 100,
      }
      const locationFilterParam = buildLocationFilterParam(placeLocationParams)

      expect(locationFilterParam).toEqual(
        JSON.stringify({
          locationType: 'PLACE',
          label: 'Rue de la Paix, Reconnaissance, Passion, Envie, Motivation et Int',
        })
      )
    })
  })
})
