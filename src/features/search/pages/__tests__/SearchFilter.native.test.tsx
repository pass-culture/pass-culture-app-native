import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/pages/reducer.helpers'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { GeoCoordinates } from 'libs/geolocation'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, act } from 'tests/utils'

import { initialSearchState } from '../reducer'
import { SearchFilter } from '../SearchFilter'

const mockSearchState = initialSearchState
const mockStateDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStateDispatch,
  }),
  useCommit: () => ({
    commit: jest.fn(),
  }),
}))

const DEFAULT_POSITION: GeoCoordinates = { latitude: 2, longitude: 40 }
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION
jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    position: mockPosition,
  }),
}))

// eslint-disable-next-line local-rules/no-react-query-provider-hoc
const renderSearchFilter = () => render(reactQueryProviderHOC(<SearchFilter />))
describe('SearchFilter component', () => {
  afterEach(() => {
    mockPosition = DEFAULT_POSITION
  })

  it('should render correctly', async () => {
    mockSearchState.locationFilter = {
      locationType: LocationType.AROUND_ME,
      aroundRadius: 100,
    }
    const { toJSON } = renderSearchFilter()
    await act(async () => {
      expect(toJSON()).toMatchSnapshot()
    })
  })

  describe('should navigate on search results with the current search state', () => {
    it('when pressing go back', async () => {
      const { getByTestId } = renderSearchFilter()

      await act(async () => {
        fireEvent.press(getByTestId('backButton'))
      })

      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        params: { ...mockSearchState, view: SearchView.Results },
        screen: 'Search',
      })
    })

    it('when pressing Rechercher', async () => {
      const { getByText } = renderSearchFilter()

      await act(async () => {
        fireEvent.press(getByText('Rechercher'))
      })

      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        params: { ...mockSearchState, view: SearchView.Results },
        screen: 'Search',
      })
    })
  })

  describe('should update the state when pressing the reset button', () => {
    it('and position is not null', async () => {
      const { getByText } = renderSearchFilter()
      await act(async () => {
        fireEvent.press(getByText('Réinitialiser'))
      })

      expect(mockStateDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: {
          ...initialSearchState,
          locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS },
          minPrice: undefined,
          maxPrice: undefined,
        },
      })
    })

    it('and position is null', async () => {
      mockPosition = null
      const { getByText } = renderSearchFilter()
      await act(async () => {
        fireEvent.press(getByText('Réinitialiser'))
      })

      expect(mockStateDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: {
          ...initialSearchState,
          locationFilter: { locationType: LocationType.EVERYWHERE },
          minPrice: undefined,
          maxPrice: undefined,
        },
      })
    })
  })

  it('should log analytics when clicking on the reset button', async () => {
    const { getByText } = renderSearchFilter()
    await act(async () => {
      fireEvent.press(getByText('Réinitialiser'))
    })

    expect(analytics.logReinitializeFilters).toBeCalledTimes(1)
  })
})
