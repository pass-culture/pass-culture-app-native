import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'

import { initialSearchState } from 'features/search/pages/reducer'
import { analytics } from 'libs/analytics'

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
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show the message depending on the query', () => {
    let text = render(<NoSearchResult />).getByText('Pas de résultat trouvé.')
    expect(text).toBeTruthy()

    mockSearchState.query = 'ZZZZZZ'
    text = render(<NoSearchResult />).getByText('Pas de résultat trouvé pour "ZZZZZZ"')
    expect(text).toBeTruthy()
  })
  it('should dispatch the right actions when pressing "autour de toi" - no location', () => {
    const button = render(<NoSearchResult />).getByText('autour de toi')
    fireEvent.press(button)
    expect(mockDispatch).toHaveBeenCalledTimes(4)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'INIT' })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SHOW_RESULTS', payload: true })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_QUERY', payload: '' })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOCATION_EVERYWHERE' })
  })
  it('should dispatch the right actions when pressing "autour de toi" - with location', () => {
    mockPosition = { latitude: 2, longitude: 40 }
    const button = render(<NoSearchResult />).getByText('autour de toi')
    fireEvent.press(button)
    expect(mockDispatch).toHaveBeenCalledTimes(4)
    expect(mockDispatch).toHaveBeenLastCalledWith({
      type: 'LOCATION_AROUND_ME',
      payload: mockPosition,
    })
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
