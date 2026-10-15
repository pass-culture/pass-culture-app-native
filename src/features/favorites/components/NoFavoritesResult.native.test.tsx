import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { NoFavoritesResult } from 'features/favorites/components/NoFavoritesResult'
import { initialFavoritesState } from 'features/favorites/context/reducer'
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

  it('should navigate to home when pressing button and log event', async () => {
    render(<NoFavoritesResult />)

    const button = screen.getByText('Explorer')
    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      screen: 'Home',
    })
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

  it('should display message with venues and artistes when wipFavoritesHub FF activated', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_FAVORITES_HUB])
    render(<NoFavoritesResult />)

    const explanations =
      'Retrouve toutes tes offres, tes artistes et tes lieux au même endroit grâce à tes favoris\u00a0!'

    expect(screen.getByText(explanations)).toBeOnTheScreen()
  })

  it('should not display specific message mentioning the offers only when wipFavoritesHub FF activated', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_FAVORITES_HUB])
    render(<NoFavoritesResult />)

    expect(screen.queryByText('Retrouve toutes tes offres en un clin d’oeil')).not.toBeOnTheScreen()
  })
})
