import React from 'react'
import { View } from 'react-native'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { simulateBackend } from 'features/favorites/tests/simulateBackend'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useFavoritesQuery } from './useFavoritesQuery'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

describe('useFavoritesQuery hook', () => {
  it('should retrieve favorite data when logged in', async () => {
    simulateBackend()
    const { result } = renderHook(useFavoritesQuery, {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    await waitFor(() => expect(result.current.isFetched).toEqual(true))

    expect(result.current.data?.favorites.length).toEqual(
      paginatedFavoritesResponseSnap.favorites.length
    )
  })

  it('should fail to fetch when not logged in', async () => {
    mockAuthContextWithoutUser()
    const { result } = renderHook(useFavoritesQuery, {
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
