import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { analytics } from 'libs/analytics'
import { GeoCoordinates } from 'libs/geolocation'
import { fireEvent, render } from 'tests/utils/web'

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
  it('should show the message depending on the query', () => {
    let text = render(<NoSearchResult />).getByText('Pas de résultat trouvé.')
    expect(text).toBeTruthy()

    mockSearchState.query = 'ZZZZZZ'
    text = render(<NoSearchResult />).getByText('Pas de résultat trouvé pour "ZZZZZZ"')
    expect(text).toBeTruthy()
  })

  it('should dispatch the right actions when pressing "autour de toi" - no location', () => {
    const button = render(<NoSearchResult />).getByText('autour de toi')
    fireEvent.click(button)
    expect(mockDispatch).toHaveBeenCalledTimes(3)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'INIT' })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_QUERY', payload: '' })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_LOCATION_EVERYWHERE' })
  })

  it('should dispatch the right actions when pressing "autour de toi" - with location', () => {
    mockPosition = { latitude: 2, longitude: 40 }
    const button = render(<NoSearchResult />).getByText('autour de toi')
    fireEvent.click(button)
    expect(mockDispatch).toHaveBeenCalledTimes(3)
    expect(mockDispatch).toHaveBeenLastCalledWith({ type: 'SET_LOCATION_AROUND_ME' })
  })

  it('should log NoSearchResult with the query', () => {
    mockSearchState.query = ''
    render(<NoSearchResult />)
    expect(analytics.logNoSearchResult).toHaveBeenLastCalledWith('')

    mockSearchState.query = 'no result query'
    render(<NoSearchResult />)
    expect(analytics.logNoSearchResult).toHaveBeenLastCalledWith('no result query')
    expect(analytics.logNoSearchResult).toHaveBeenCalledTimes(2)
  })
})
