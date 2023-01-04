import { NativeScrollEvent } from 'react-native'

import { GenreType, SearchGroupNameEnumv2, NativeCategoryIdEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { buildPerformSearchState, isCloseToBottom } from 'libs/firebase/analytics/utils'

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
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        date: null,
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
      })
    })

    it('with date filter', () => {
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        date: { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: TODAY.toISOString() },
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchDate: JSON.stringify({
          option: DATE_FILTER_OPTIONS.TODAY,
          selectedDate: TODAY.toISOString(),
        }),
      })
    })

    it('with location filter', () => {
      const partialSearchState = buildPerformSearchState(initialSearchState)
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
      })
    })

    it('when user press an autocomplete suggestion', () => {
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        isAutocomplete: true,
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchIsAutocomplete: true,
      })
    })

    it('with max price filter', () => {
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        maxPrice: '30',
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchMaxPrice: '30',
      })
    })

    it('with min price filter', () => {
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        minPrice: '10',
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchMinPrice: '10',
      })
    })

    it('with an empty array of category filter', () => {
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        offerCategories: [],
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
      })
    })

    it('with a category filter', () => {
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchCategories: JSON.stringify([SearchGroupNameEnumv2.FILMS_SERIES_CINEMA]),
      })
    })

    it('with an empty array of genre/types filter', () => {
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        offerGenreTypes: [],
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
      })
    })

    it('with a genre/types filter', () => {
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        offerGenreTypes: [{ key: GenreType.MUSIC, name: 'Pop', value: 'Pop' }],
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchGenreTypes: JSON.stringify([{ key: GenreType.MUSIC, name: 'Pop', value: 'Pop' }]),
      })
    })

    it('with duo offer filter', () => {
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        offerIsDuo: true,
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchOfferIsDuo: true,
      })
    })

    it('with free offer filter', () => {
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        offerIsFree: true,
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchOfferIsFree: true,
      })
    })

    it('with an empty array of native category filter', () => {
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        offerNativeCategories: [],
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
      })
    })

    it('with a native category filter', () => {
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        offerNativeCategories: [NativeCategoryIdEnumv2.CD_VINYLES],
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchNativeCategories: JSON.stringify([NativeCategoryIdEnumv2.CD_VINYLES]),
      })
    })

    it('with an empty query', () => {
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        query: '',
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
      })
    })

    it('with a query', () => {
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        query: 'angele',
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchQuery: 'angele',
      })
    })

    it('when time rangeis null', () => {
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        timeRange: null,
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
      })
    })

    it('with time range filter', () => {
      const partialSearchState = buildPerformSearchState({
        ...initialSearchState,
        timeRange: [18, 22],
      })
      expect(partialSearchState).toEqual({
        searchLocationFilter: JSON.stringify(initialSearchState.locationFilter),
        searchTimeRange: JSON.stringify([18, 22]),
      })
    })
  })
})
