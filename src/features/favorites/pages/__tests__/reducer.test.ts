import mockdate from 'mockdate'

import { initialFavoritesState, favoritesReducer } from '../reducer'

const Today = new Date(2020, 10, 1)

describe('Favorites reducer', () => {
  beforeAll(() => {
    mockdate.set(Today)
  })

  const state = initialFavoritesState
  it('should handle SHOW_RESULTS', () => {
    let newState = favoritesReducer(state, { type: 'SHOW_RESULTS', payload: true })
    expect(newState).toStrictEqual({ ...state, showResults: true })
    newState = favoritesReducer(newState, { type: 'SHOW_RESULTS', payload: false })
    expect(newState).toStrictEqual({ ...state, showResults: false })
  })
})
