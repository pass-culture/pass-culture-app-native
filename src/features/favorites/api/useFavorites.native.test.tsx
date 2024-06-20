import * as React from 'react'
import { View } from 'react-native'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { simulateBackend } from 'features/favorites/helpers/simulateBackend'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { useFavorites } from './useFavorites'

jest.mock('features/auth/context/AuthContext')
const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock
jest.mock('libs/jwt')

describe('useFavorites hook', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

  it('should retrieve favorite data when logged in', async () => {
    simulateBackend()
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
    mockAuthContextWithoutUser()
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
