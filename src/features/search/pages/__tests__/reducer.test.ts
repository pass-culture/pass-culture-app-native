import mockdate from 'mockdate'

import { LocationType } from 'libs/algolia'
import { DATE_FILTER_OPTIONS } from 'libs/algolia/enums'
import { SuggestedPlace } from 'libs/place'

import { Action, initialSearchState, searchReducer, SearchState } from '../reducer'
import { MAX_PRICE } from '../reducer.helpers'

const Today = new Date(2020, 10, 1)
const Tomorrow = new Date(2020, 10, 2)

const Kourou: SuggestedPlace = {
  name: { long: 'Kourou', short: 'Kourou' },
  extraData: { city: 'Kourou', department: 'Guyane' },
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

describe('Search reducer', () => {
  beforeAll(() => {
    mockdate.set(Today)
  })

  const state = initialSearchState
  it('should handle INIT', () => {
    const action: Action = { type: 'INIT' }
    expect(searchReducer({} as SearchState, action)).toStrictEqual(initialSearchState)
  })

  it('should handle INIT_FROM_SEE_MORE', () => {
    const parameters = {
      geolocation: { latitude: 48.8557, longitude: 2.3469 },
      offerCategories: [
        'CINEMA',
        'MUSIQUE',
        'LECON',
        'FILM',
        'JEUX_VIDEO',
        'CONFERENCE',
        'INSTRUMENT',
      ],
      tags: [],
    }
    const action: Action = { type: 'INIT_FROM_SEE_MORE', payload: parameters }
    expect(searchReducer(state, action)).toStrictEqual({
      ...initialSearchState,
      ...parameters,
      priceRange: [0, 300],
    })
  })
  it('should handle INIT_FROM_SEE_MORE - MAX_PRICE', () => {
    const parameters = {
      offerCategories: ['CINEMA', 'MUSIQUE'],
      priceRange: [30, 500],
    }
    const action: Action = {
      type: 'INIT_FROM_SEE_MORE',
      payload: parameters as Partial<SearchState>,
    }
    expect(searchReducer(state, action)).toStrictEqual({
      ...initialSearchState,
      offerCategories: ['CINEMA', 'MUSIQUE'],
      priceRange: [30, MAX_PRICE],
    })
  })

  it('should handle PRICE_RANGE', () => {
    const action: Action = { type: 'PRICE_RANGE', payload: [30, 200] as SearchState['priceRange'] }
    expect(searchReducer(state, action)).toStrictEqual({
      ...initialSearchState,
      priceRange: [30, 200],
    })
  })
  it('should handle TIME_RANGE', () => {
    const action: Action = { type: 'TIME_RANGE', payload: [10, 24] as SearchState['timeRange'] }
    expect(searchReducer(state, action)).toStrictEqual({
      ...initialSearchState,
      timeRange: [10, 24],
    })
  })

  it('should handle TOGGLE_CATEGORY', () => {
    // 1. Add JEUX_VIDEO
    let newState = searchReducer(state, { type: 'TOGGLE_CATEGORY', payload: 'JEUX_VIDEO' })
    expect(newState).toStrictEqual({ ...state, offerCategories: ['JEUX_VIDEO'] })

    // 2. Add CINEMA
    newState = searchReducer(newState, { type: 'TOGGLE_CATEGORY', payload: 'CINEMA' })
    expect(newState).toStrictEqual({ ...state, offerCategories: ['JEUX_VIDEO', 'CINEMA'] })

    // 3. Remove JEUX_VIDEO
    newState = searchReducer(newState, { type: 'TOGGLE_CATEGORY', payload: 'JEUX_VIDEO' })
    expect(newState).toStrictEqual({ ...state, offerCategories: ['CINEMA'] })
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
    const action: Action = { type: 'SET_CATEGORY', payload: ['JEUX_VIDEO'] }
    let newState = searchReducer(state, action)
    expect(newState.offerCategories).toStrictEqual(['JEUX_VIDEO'])

    newState = searchReducer(newState, { type: 'SET_CATEGORY', payload: [] })
    expect(newState.offerCategories).toStrictEqual([])
  })
  it('should handle LOCATION_AROUND_ME', () => {
    const newState = searchReducer(state, {
      type: 'LOCATION_AROUND_ME',
      payload: { latitude: 48.8557, longitude: 2.3469 },
    })
    expect(newState.locationType).toEqual(LocationType.AROUND_ME)
    expect(newState.geolocation).toEqual({ latitude: 48.8557, longitude: 2.3469 })
    expect(newState.place).toBeNull()
  })
  it('should handle LOCATION_EVERYWHERE', () => {
    const newState = searchReducer(
      {
        ...state,
        geolocation: { latitude: 48.8557, longitude: 2.3469 },
        locationType: LocationType.PLACE,
        place: Kourou,
      },
      { type: 'LOCATION_EVERYWHERE' }
    )
    expect(newState.locationType).toEqual(LocationType.EVERYWHERE)
    expect(newState.geolocation).toBeNull()
    expect(newState.place).toBeNull()
  })
  it('should handle LOCATION_PLACE', () => {
    const newState = searchReducer(state, { type: 'LOCATION_PLACE', payload: Kourou })
    expect(newState.locationType).toEqual(LocationType.PLACE)
    expect(newState.geolocation).toEqual(Kourou.geolocation)
    expect(newState.place).toStrictEqual(Kourou)
  })
})
