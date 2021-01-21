import { Action, initialSearchState, searchReducer, SearchState } from '../reducer'
import { MAX_PRICE } from '../reducer.helpers'

describe('Search reducer', () => {
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

  it('should handle CATEGORIES', () => {
    // 1. Add JEUX_VIDEO
    let newState = searchReducer(state, { type: 'CATEGORIES', payload: 'JEUX_VIDEO' })
    expect(newState).toStrictEqual({ ...state, offerCategories: ['JEUX_VIDEO'] })

    // 2. Add CINEMA
    newState = searchReducer(newState, { type: 'CATEGORIES', payload: 'CINEMA' })
    expect(newState).toStrictEqual({ ...state, offerCategories: ['JEUX_VIDEO', 'CINEMA'] })

    // 3. Remove JEUX_VIDEO
    newState = searchReducer(newState, { type: 'CATEGORIES', payload: 'JEUX_VIDEO' })
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
})
