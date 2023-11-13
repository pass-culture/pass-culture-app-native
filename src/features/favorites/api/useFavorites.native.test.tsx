import * as React from 'react'
import { View } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { simulateBackend } from 'features/favorites/helpers/simulateBackend'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { useFavorites } from './useFavorites'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

jest.unmock('react-query')

describe('useFavorites hook', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

  it('should retrieve favorite data when logged in', async () => {
    simulateBackend()
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
    const { result } = renderHook(useFavorites, {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    expect(result.current.isFetching).toEqual(true)

    await act(async () => {})

    expect(result.current.data?.favorites.length).toEqual(
      paginatedFavoritesResponseSnap.favorites.length
    )
  })

  it('should fail to fetch when not logged in', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })

    const { result } = renderHook(useFavorites, {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    expect(result.current.isFetching).toEqual(false)
  })

  it('should fail to fetch when logged in but offline', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })

    const { result } = renderHook(useFavorites, {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    expect(result.current.isFetching).toEqual(false)
  })
})
