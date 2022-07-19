import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { MAX_RADIUS } from 'features/search/pages/reducer.helpers'
import { analytics } from 'libs/firebase/analytics'
import { GeoCoordinates } from 'libs/geolocation'
import { fireEvent, render } from 'tests/utils'

import { NoSearchResult } from '../NoSearchResult'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
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
    useRoute.mockReturnValueOnce({ params: { showResults: true, query: '' } })

    let text = render(<NoSearchResult />).getByText('Pas de résultat trouvé.')
    expect(text).toBeTruthy()

    useRoute.mockReturnValueOnce({ params: { showResults: true, query: 'ZZZZZZ' } })
    text = render(<NoSearchResult />).getByText('Pas de résultat trouvé pour "ZZZZZZ"')
    expect(text).toBeTruthy()
  })

  it('should dispatch the right actions when pressing "autour de toi" - no location', () => {
    const button = render(<NoSearchResult />).getByText('autour de toi')
    fireEvent.press(button)
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenLastCalledWith('TabNavigator', {
      screen: 'Search',
      params: {
        ...initialSearchState,
        locationFilter: {
          locationType: LocationType.EVERYWHERE,
        },
        showResults: true,
      },
    })
  })

  it('should dispatch the right actions when pressing "autour de toi" - with location', () => {
    mockPosition = { latitude: 2, longitude: 40 }
    const button = render(<NoSearchResult />).getByText('autour de toi')
    fireEvent.press(button)
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenLastCalledWith('TabNavigator', {
      screen: 'Search',
      params: {
        ...initialSearchState,
        locationFilter: {
          locationType: LocationType.AROUND_ME,
          aroundRadius: MAX_RADIUS,
        },
        showResults: true,
      },
    })
  })

  it('should log NoSearchResult with the query', () => {
    useRoute.mockReturnValueOnce({ params: { showResults: true, query: '' } })

    render(<NoSearchResult />)
    expect(analytics.logNoSearchResult).not.toHaveBeenLastCalledWith('')

    useRoute.mockReturnValueOnce({ params: { showResults: true, query: 'no result query' } })
    render(<NoSearchResult />)
    expect(analytics.logNoSearchResult).toHaveBeenLastCalledWith('no result query')
    expect(analytics.logNoSearchResult).toHaveBeenCalledTimes(1)
  })
})
