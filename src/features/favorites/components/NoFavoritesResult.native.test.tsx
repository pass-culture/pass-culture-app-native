import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { NoFavoritesResult } from 'features/favorites/components/NoFavoritesResult'
import { initialFavoritesState } from 'features/favorites/context/reducer'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, userEvent } from 'tests/utils'

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

const user = userEvent.setup()
jest.useFakeTimers()

describe('NoFavoritesResult component', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should show the message', () => {
    render(<NoFavoritesResult />)
    const text = screen.getByText(`Retrouve toutes tes offres en un clin d’oeil`)

    expect(text).toBeOnTheScreen()
  })

  it('should navigate to Search when pressing button and log event', async () => {
    render(<NoFavoritesResult />)

    const button = screen.getByText('Découvrir le catalogue')
    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: { params: undefined, screen: 'SearchLanding' },
      screen: 'SearchStackNavigator',
    })
    expect(analytics.logDiscoverOffers).toHaveBeenCalledWith('favorites')
  })

  it('should display empty favorites icon when wipNewVisionUi FF is deactivated', () => {
    render(<NoFavoritesResult />)

    expect(screen.getByTestId('empty-favorites-icon')).toBeOnTheScreen()
  })

  it('should display remote illustration when wipNewVisionUi FF is activated', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_VISION_UI])
    render(<NoFavoritesResult />)

    expect(screen.getByTestId('remote-illustration')).toBeOnTheScreen()
  })
})
