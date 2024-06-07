import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { NoFavoritesResult } from 'features/favorites/components/NoFavoritesResult'
import { initialFavoritesState } from 'features/favorites/context/reducer'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const mockFavoritesState = initialFavoritesState
const mockDispatch = jest.fn()

jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockFavoritesState,
    dispatch: mockDispatch,
  }),
}))

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

describe('NoFavoritesResult component', () => {
  it('should show the message', () => {
    render(<NoFavoritesResult />)
    const text = screen.getByText(`Retrouve toutes tes offres en un clin d’oeil`)

    expect(text).toBeOnTheScreen()
  })

  it('should navigate to Search when pressing button and log event', async () => {
    render(<NoFavoritesResult />)

    const button = screen.getByText('Découvrir le catalogue')
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        params: { params: undefined, screen: 'SearchLanding' },
        screen: 'SearchStackNavigator',
      })
      expect(analytics.logDiscoverOffers).toHaveBeenCalledWith('favorites')
    })
  })
})
