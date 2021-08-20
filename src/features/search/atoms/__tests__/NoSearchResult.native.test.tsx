import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { analytics } from 'libs/analytics'
import { GeoCoordinates } from 'libs/geolocation'
import { fireEvent, render, superFlushWithAct } from 'tests/utils'

import { NoSearchResult } from '../NoSearchResult'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

let mockPosition: Pick<GeoCoordinates, 'latitude' | 'longitude'> | null = null
jest.mock('libs/geolocation', () => ({
  useGeolocation: jest.fn(() => ({ position: mockPosition })),
}))

describe('NoSearchResult component', () => {
  afterEach(jest.clearAllMocks)

  it('should show the message depending on the query - empty query', () => {
    const { findByText } = render(<NoSearchResult />)
    findByText('Pas de résultat trouvé.')
  })

  it('should show the message depending on the query - text query', () => {
    mockSearchState.query = 'ZZZZZZ'
    const { findByText } = render(<NoSearchResult />)
    findByText('Pas de résultat trouvé pour "ZZZZZZ"')
  })

  it('should dispatch the right actions when pressing "autour de toi" - no location', () => {
    const button = render(<NoSearchResult />).getByText('autour de toi')
    fireEvent.press(button)
    expect(mockDispatch).toHaveBeenCalledTimes(3)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'INIT' })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_QUERY', payload: '' })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOCATION_EVERYWHERE' })
  })

  it('should dispatch the right actions when pressing "autour de toi" - with location', () => {
    mockPosition = { latitude: 2, longitude: 40 }
    const button = render(<NoSearchResult />).getByText('autour de toi')
    fireEvent.press(button)
    expect(mockDispatch).toHaveBeenCalledTimes(3)
    expect(mockDispatch).toHaveBeenLastCalledWith({
      type: 'LOCATION_AROUND_ME',
      payload: mockPosition,
    })
  })

  it('should log NoSearchResult with the query - empty query', async () => {
    mockSearchState.query = ''
    render(<NoSearchResult />)
    await superFlushWithAct(1)
    expect(analytics.logNoSearchResult).toHaveBeenLastCalledWith('')
  })

  it('should log NoSearchResult with the query - text query', async () => {
    mockSearchState.query = 'no result query'
    render(<NoSearchResult />)
    await superFlushWithAct(1)
    expect(analytics.logNoSearchResult).toHaveBeenLastCalledWith('no result query')
  })
})
