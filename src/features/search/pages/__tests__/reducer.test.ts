import mockdate from 'mockdate'

import { SearchGroupNameEnum } from 'api/gen'
import { LocationType } from 'features/search/enums'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { MAX_PRICE } from 'features/search/pages/reducer.helpers'
import { SearchState } from 'features/search/types'
import { SuggestedPlace } from 'libs/place'

import { Action, initialSearchState, searchReducer } from '../reducer'

const Today = new Date(2020, 10, 1)
const Tomorrow = new Date(2020, 10, 2)

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

describe('Search reducer', () => {
  beforeAll(() => {
    mockdate.set(Today)
  })

  const state = initialSearchState
  it('should handle INIT', () => {
    let searchState = { showResults: false } as SearchState
    expect(searchReducer(searchState, { type: 'INIT' })).toStrictEqual({
      ...initialSearchState,
      showResults: false,
    })
    searchState = { showResults: true } as SearchState
    expect(searchReducer(searchState, { type: 'INIT' })).toStrictEqual({
      ...initialSearchState,
      showResults: true,
    })
  })

  it('should handle SET_STATE_FROM_NAVIGATE', () => {
    const parameters = {
      geolocation: { latitude: 48.8557, longitude: 2.3469 },
      offerCategories: [
        SearchGroupNameEnum.CINEMA,
        SearchGroupNameEnum.MUSIQUE,
        SearchGroupNameEnum.COURS,
        SearchGroupNameEnum.FILM,
        SearchGroupNameEnum.JEU,
        SearchGroupNameEnum.CONFERENCE,
        SearchGroupNameEnum.INSTRUMENT,
      ],
      tags: [],
    }
    const action: Action = { type: 'SET_STATE_FROM_NAVIGATE', payload: parameters }
    expect(searchReducer(state, action)).toStrictEqual({
      ...initialSearchState,
      ...parameters,
      priceRange: [0, MAX_PRICE],
    })
  })

  it('should handle SET_STATE_FROM_NAVIGATE - MAX_PRICE', () => {
    const parameters = {
      offerCategories: [SearchGroupNameEnum.CINEMA, SearchGroupNameEnum.MUSIQUE],
      priceRange: [30, 500],
    }
    const action: Action = {
      type: 'SET_STATE_FROM_NAVIGATE',
      payload: parameters as Partial<SearchState>,
    }
    expect(searchReducer(state, action)).toStrictEqual({
      ...initialSearchState,
      offerCategories: [SearchGroupNameEnum.CINEMA, SearchGroupNameEnum.MUSIQUE],
      priceRange: [30, MAX_PRICE],
    })
  })

  it('should handle PRICE_RANGE', () => {
    const action: Action = {
      type: 'PRICE_RANGE',
      payload: [30, 200] as SearchState['priceRange'],
    }
    expect(searchReducer(state, action)).toStrictEqual({
      ...initialSearchState,
      priceRange: [30, 200],
    })
  })

  it('should handle RADIUS - nothing if locationType EVERYWHERE', () => {
    const action: Action = { type: 'RADIUS', payload: 30 }
    const newState = searchReducer(
      { ...state, locationFilter: { locationType: LocationType.EVERYWHERE } },
      action
    )
    expect(newState.locationFilter).toStrictEqual(initialSearchState.locationFilter)
  })

  it('should handle RADIUS - if locationType AROUND_ME', () => {
    const action: Action = { type: 'RADIUS', payload: 30 }
    const newState = searchReducer(
      { ...state, locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: null } },
      action
    )
    expect(newState.locationFilter).toStrictEqual({
      locationType: LocationType.AROUND_ME,
      aroundRadius: 30,
    })
  })

  it('should handle RADIUS - if locationType PLACE', () => {
    const action: Action = { type: 'RADIUS', payload: 30 }
    const newState = searchReducer(
      {
        ...state,
        locationFilter: { locationType: LocationType.PLACE, aroundRadius: 10, place: Kourou },
      },
      action
    )
    expect(newState.locationFilter).toStrictEqual({
      locationType: LocationType.PLACE,
      aroundRadius: 30,
      place: Kourou,
    })
  })

  it('should handle TIME_RANGE', () => {
    const action: Action = {
      type: 'TIME_RANGE',
      payload: [10, 24] as SearchState['timeRange'],
    }
    expect(searchReducer(state, action)).toStrictEqual({
      ...initialSearchState,
      timeRange: [10, 24],
    })
  })

  it('should handle TOGGLE_CATEGORY', () => {
    // 1. Add JEUX_VIDEO
    let newState = searchReducer(state, {
      type: 'TOGGLE_CATEGORY',
      payload: SearchGroupNameEnum.JEU,
    })
    expect(newState).toStrictEqual({ ...state, offerCategories: [SearchGroupNameEnum.JEU] })

    // 2. Add CINEMA
    newState = searchReducer(newState, {
      type: 'TOGGLE_CATEGORY',
      payload: SearchGroupNameEnum.CINEMA,
    })
    expect(newState).toStrictEqual({
      ...state,
      // Note: the categories are sorted to later reuse react-query cache
      offerCategories: [SearchGroupNameEnum.CINEMA, SearchGroupNameEnum.JEU],
    })

    // 3. Remove JEUX_VIDEO
    newState = searchReducer(newState, {
      type: 'TOGGLE_CATEGORY',
      payload: SearchGroupNameEnum.JEU,
    })
    expect(newState).toStrictEqual({ ...state, offerCategories: [SearchGroupNameEnum.CINEMA] })
  })

  it('should handle OFFER_TYPE', () => {
    // 1. Add isDigital
    let newState = searchReducer(state, { type: 'OFFER_TYPE', payload: 'isDigital' })
    expect(newState.offerTypes).toStrictEqual({ isDigital: true, isThing: false, isEvent: false })

    // 2. Add isThing
    newState = searchReducer(newState, { type: 'OFFER_TYPE', payload: 'isThing' })
    expect(newState.offerTypes).toStrictEqual({ isDigital: true, isThing: true, isEvent: false })

    // 3. Remove isDigital
    newState = searchReducer(newState, { type: 'OFFER_TYPE', payload: 'isDigital' })
    expect(newState.offerTypes).toStrictEqual({ isDigital: false, isThing: true, isEvent: false })
  })

  it('should handle SHOW_RESULTS', () => {
    let newState = searchReducer(state, { type: 'SHOW_RESULTS', payload: true })
    expect(newState).toStrictEqual({ ...state, showResults: true })
    newState = searchReducer(newState, { type: 'SHOW_RESULTS', payload: false })
    expect(newState).toStrictEqual({ ...state, showResults: false })
  })

  it('should handle TOGGLE_OFFER_FREE', () => {
    let newState = searchReducer(state, { type: 'TOGGLE_OFFER_FREE' })
    expect(newState).toStrictEqual({ ...state, offerIsFree: true })
    newState = searchReducer(newState, { type: 'TOGGLE_OFFER_FREE' })
    expect(newState).toStrictEqual({ ...state, offerIsFree: false })
  })

  it('should handle TOGGLE_OFFER_DUO', () => {
    let newState = searchReducer(state, { type: 'TOGGLE_OFFER_DUO' })
    expect(newState).toStrictEqual({ ...state, offerIsDuo: true })
    newState = searchReducer(newState, { type: 'TOGGLE_OFFER_DUO' })
    expect(newState).toStrictEqual({ ...state, offerIsDuo: false })
  })

  it('should handle TOGGLE_OFFER_NEW', () => {
    let newState = searchReducer(state, { type: 'TOGGLE_OFFER_NEW' })
    expect(newState).toStrictEqual({ ...state, offerIsNew: true })
    newState = searchReducer(newState, { type: 'TOGGLE_OFFER_NEW' })
    expect(newState).toStrictEqual({ ...state, offerIsNew: false })
  })

  it('should handle TOGGLE_DATE', () => {
    let newState = searchReducer(state, { type: 'TOGGLE_DATE' })
    expect(newState.date).toStrictEqual({ option: DATE_FILTER_OPTIONS.TODAY, selectedDate: Today })
    newState = searchReducer(newState, { type: 'TOGGLE_DATE' })
    expect(newState.date).toBeNull()
  })

  it('should handle SELECT_DATE_FILTER_OPTION', () => {
    // 1. No effect if we haven't selected Date before
    let newState = searchReducer(state, {
      type: 'SELECT_DATE_FILTER_OPTION',
      payload: DATE_FILTER_OPTIONS.TODAY,
    })
    expect(newState.date).toBeNull()

    // 2. We enable Date, the section 'Date de l'offre' appears and the actions have an effect
    newState = searchReducer(newState, { type: 'TOGGLE_DATE' })
    expect(newState.date?.option).toStrictEqual(DATE_FILTER_OPTIONS.TODAY) // "Aujourd'hui" by default

    // 3. We pick the 'Cette semaine'
    newState = searchReducer(newState, {
      type: 'SELECT_DATE_FILTER_OPTION',
      payload: DATE_FILTER_OPTIONS.CURRENT_WEEK,
    })
    expect(newState.date?.option).toStrictEqual(DATE_FILTER_OPTIONS.CURRENT_WEEK)

    // 4. We pick the 'Ce week-end'
    newState = searchReducer(newState, {
      type: 'SELECT_DATE_FILTER_OPTION',
      payload: DATE_FILTER_OPTIONS.CURRENT_WEEK_END,
    })
    expect(newState.date?.option).toStrictEqual(DATE_FILTER_OPTIONS.CURRENT_WEEK_END)

    // 5. We pick the 'Date précise'
    newState = searchReducer(newState, {
      type: 'SELECT_DATE_FILTER_OPTION',
      payload: DATE_FILTER_OPTIONS.USER_PICK,
    })
    expect(newState.date?.option).toStrictEqual(DATE_FILTER_OPTIONS.USER_PICK)
  })

  it('should handle TOGGLE_HOUR', () => {
    let newState = searchReducer(state, { type: 'TOGGLE_HOUR' })
    expect(newState.timeRange).toStrictEqual([8, 24])
    newState = searchReducer(newState, { type: 'TOGGLE_HOUR' })
    expect(newState.timeRange).toBeNull()
  })

  it('should handle SELECT_DATE', () => {
    // 1. No effect if we haven't selected Date before
    let newState = searchReducer(state, { type: 'SELECT_DATE', payload: Today })
    expect(newState.date).toBeNull()

    // 2. We choose another date after enabling section Date de l'offre
    newState = searchReducer(newState, { type: 'TOGGLE_DATE' })
    newState = searchReducer(newState, { type: 'SELECT_DATE', payload: Tomorrow })
    expect(newState.date?.selectedDate).toStrictEqual(Tomorrow)
  })

  it('should handle SET_CATEGORY', () => {
    const action: Action = { type: 'SET_CATEGORY', payload: [SearchGroupNameEnum.JEU] }
    let newState = searchReducer(state, action)
    expect(newState.offerCategories).toStrictEqual([SearchGroupNameEnum.JEU])

    newState = searchReducer(newState, { type: 'SET_CATEGORY', payload: [] })
    expect(newState.offerCategories).toStrictEqual([])
  })

  it('should handle SET_LOCATION_AROUND_ME', () => {
    const newState = searchReducer(state, { type: 'SET_LOCATION_AROUND_ME' })
    expect(newState.locationFilter.locationType).toEqual(LocationType.AROUND_ME)
  })

  it('should handle SET_LOCATION_EVERYWHERE', () => {
    const newState = searchReducer(
      {
        ...state,
        locationFilter: { aroundRadius: 20, locationType: LocationType.PLACE, place: Kourou },
      },
      { type: 'SET_LOCATION_EVERYWHERE' }
    )
    expect(newState.locationFilter.locationType).toEqual(LocationType.EVERYWHERE)
  })

  it('should handle SET_LOCATION_PLACE', () => {
    const newState = searchReducer(state, {
      type: 'SET_LOCATION_PLACE',
      payload: { place: Kourou },
    })
    expect(newState.locationFilter).toStrictEqual({
      locationType: LocationType.PLACE,
      place: Kourou,
      aroundRadius: 100,
    })
  })

  it('should handle SET_LOCATION_VENUE', () => {
    const venue = {
      label: 'La petite librairie',
      info: 'Michel Léon',
      geolocation: Kourou.geolocation,
      venueId: 5959,
    }
    const action: Action = { type: 'SET_LOCATION_VENUE', payload: venue }

    const newState = searchReducer(state, action)

    expect(newState.locationFilter).toStrictEqual({ locationType: LocationType.VENUE, venue })
  })
})
