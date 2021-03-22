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
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

describe('Favorites component', () => {
  afterEach(async () => {
    jest.clearAllMocks()
    await cleanup()
  })

  it('should render correctly', () => {
    const { toJSON } = renderFavorites({ isLoggedIn: true })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should show non connected page when not logged in', () => {
    const { getByText } = renderFavorites({ isLoggedIn: false })
    expect(getByText('Connecte-toi pour profiter de cette fonctionnalité !')).toBeTruthy()
  })

  it('should show loading when not logged in', () => {
    renderFavorites({ isLoggedIn: false })
    expect(mockDispatch).not.toBeCalledWith({ type: 'SHOW_RESULTS', payload: true })
  })
})

function renderFavorites({ isLoggedIn }: { isLoggedIn: boolean }) {
  const setIsLoggedIn = jest.fn()
  mockUseAuthContext.mockImplementation(() => ({ isLoggedIn, setIsLoggedIn }))
  return render(reactQueryProviderHOC(<Favorites />))
}
