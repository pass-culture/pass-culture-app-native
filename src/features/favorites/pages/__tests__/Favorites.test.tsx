import { cleanup, render } from '@testing-library/react-native'
import React from 'react'

import { useAuthContext } from 'features/auth/AuthContext'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { Favorites } from '../Favorites'
import { initialFavoritesState } from '../reducer'

const mockSearchState = initialFavoritesState
const mockDispatch = jest.fn()
jest.mock('features/favorites/pages/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockSearchState,
    dispatch: mockDispatch,
  }),
}))
jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

describe('Favorites component', () => {
  afterEach(async () => {
    jest.clearAllMocks()
    await cleanup()
  })

  it('should render correctly', () => {
    const { toJSON } = renderFavorites(true)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should trigger data loading when logged in', () => {
    renderFavorites(true)
    expect(mockDispatch).toBeCalledWith({ type: 'SHOW_RESULTS', payload: true })
    mockUseAuthContext.mockClear()
  })

  it('should show loading when not logged in', () => {
    renderFavorites(false)
    expect(mockDispatch).not.toBeCalledWith({ type: 'SHOW_RESULTS', payload: true })
  })
})

function renderFavorites(isLoggedIn: boolean) {
  mockUseAuthContext.mockImplementation(() => ({ isLoggedIn }))
  return render(reactQueryProviderHOC(<Favorites />))
}
