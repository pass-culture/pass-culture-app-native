import mockdate from 'mockdate'

import { initialFavoritesState, favoritesReducer } from './reducer'

const Today = new Date(2020, 10, 1)

describe('Favorites reducer', () => {
  beforeAll(() => {
    mockdate.set(Today)
  })

  const state = initialFavoritesState
  it('should handle SET_RESULTS and INIT', () => {
    let newState = favoritesReducer(state, { type: 'SET_SORT_BY', payload: 'ASCENDING_PRICE' })
    expect(newState).toStrictEqual({ ...state, sortBy: 'ASCENDING_PRICE' })
    newState = favoritesReducer(newState, { type: 'INIT' })
    expect(newState).toStrictEqual(initialFavoritesState)
  })
})
