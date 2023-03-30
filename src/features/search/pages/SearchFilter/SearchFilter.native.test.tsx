import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { GeoCoordinates } from 'libs/geolocation'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { SearchFilter } from './SearchFilter'

const mockSearchState = initialSearchState
const mockStateDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStateDispatch,
  }),
}))

const DEFAULT_POSITION: GeoCoordinates = { latitude: 2, longitude: 40 }
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION
jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    position: mockPosition,
  }),
}))

describe('<SearchFilter/>', () => {
  afterEach(() => {
    mockPosition = DEFAULT_POSITION
  })

  it('should render correctly', async () => {
    mockSearchState.locationFilter = {
      locationType: LocationType.AROUND_ME,
      aroundRadius: 100,
    }
    const { toJSON } = renderSearchFilter()

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot()
    })
  })

  it('should load url params when opening the general filters page', async () => {
    useRoute.mockReturnValueOnce({
      params: { offerCategories: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE] },
    })
    renderSearchFilter()

    await waitFor(() => {
      expect(mockStateDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: { offerCategories: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE] },
      })
    })
  })

  describe('should navigate on search results with the current search state', () => {
    it('when pressing go back', async () => {
      useRoute.mockReturnValueOnce({ params: initialSearchState })
      renderSearchFilter()

      fireEvent.press(screen.getByTestId('Fermer'))

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: { ...initialSearchState, view: SearchView.Results },
          screen: 'Search',
        })
      })
    })

    it('when pressing Rechercher', async () => {
      renderSearchFilter()

      fireEvent.press(screen.getByText('Rechercher'))

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: { ...mockSearchState, view: SearchView.Results },
          screen: 'Search',
        })
      })
    })
  })

  describe('should update the state when pressing the reset button', () => {
    it('and position is not null', async () => {
      renderSearchFilter()

      fireEvent.press(screen.getByText('Réinitialiser'))

      await waitFor(() => {
        expect(mockStateDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: {
            ...initialSearchState,
            locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS },
            minPrice: undefined,
            maxPrice: undefined,
            offerGenreTypes: undefined,
            offerNativeCategories: undefined,
          },
        })
      })
    })

    it('and position is null', async () => {
      mockPosition = null
      renderSearchFilter()

      fireEvent.press(screen.getByText('Réinitialiser'))

      await waitFor(() => {
        expect(mockStateDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: {
            ...initialSearchState,
            locationFilter: { locationType: LocationType.EVERYWHERE },
            minPrice: undefined,
            maxPrice: undefined,
            offerGenreTypes: undefined,
            offerNativeCategories: undefined,
          },
        })
      })
    })
  })

  it('should log analytics when clicking on the reset button', async () => {
    renderSearchFilter()

    fireEvent.press(screen.getByText('Réinitialiser'))

    await waitFor(() => {
      expect(analytics.logReinitializeFilters).toBeCalledTimes(1)
    })
  })

  it('should display close button on header', async () => {
    renderSearchFilter()

    await waitFor(() => {
      expect(screen.getByTestId('Fermer')).toBeTruthy()
    })
  })

  it('should not display back button on header', async () => {
    renderSearchFilter()

    await waitFor(() => {
      expect(screen.queryByTestId('Revenir en arrière')).toBeFalsy()
    })
  })
})

// eslint-disable-next-line local-rules/no-react-query-provider-hoc
const renderSearchFilter = () => render(reactQueryProviderHOC(<SearchFilter />))
