import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialFavoritesState } from 'features/favorites/pages/reducer'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'

import { NoFavoritesResult } from '../NoFavoritesResult'

const mockFavoritesState = initialFavoritesState
const mockDispatch = jest.fn()
const mockDispatchSearch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    dispatch: mockDispatchSearch,
  }),
}))

jest.mock('features/favorites/pages/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockFavoritesState,
    dispatch: mockDispatch,
  }),
}))

describe('NoFavoritesResult component', () => {
  it('should show the message', () => {
    const text = render(<NoFavoritesResult />).getByText(
      `Retrouve toutes tes offres en un clin d'oeil en les ajoutant à tes favoris\u00a0!`
    )
    expect(text).toBeTruthy()
  })

  it('should navigate to Search when pressing button and log event', () => {
    const renderAPI = render(<NoFavoritesResult />)
    const button = renderAPI.getByText('Explorer les offres')
    fireEvent.press(button)
    expect(navigate).toBeCalledWith(...getTabNavConfig('Search', { showResults: true }))
    expect(analytics.logDiscoverOffers).toHaveBeenCalledWith('favorites')
  })
})
