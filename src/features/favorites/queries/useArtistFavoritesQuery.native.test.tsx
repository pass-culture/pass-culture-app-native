import React from 'react'
import { View } from 'react-native'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { paginatedArtistFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedArtistFavoritesResponseSnap'
import { useArtistFavoritesQuery } from 'features/favorites/queries/useArtistFavoritesQuery'
import { simulateBackendForArtist } from 'features/favorites/tests/simulateBackendForArtist'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

describe('useArtistFavoritesQuery hook', () => {
  it('should retrieve favorite data when logged in', async () => {
    simulateBackendForArtist()
    const { result } = renderHook(useArtistFavoritesQuery, {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    await waitFor(() => expect(result.current.isFetched).toEqual(true))

    expect(result.current.data?.favorites.length).toEqual(
      paginatedArtistFavoritesResponseSnap.favorites.length
    )
  })

  it('should fail to fetch when not logged in', async () => {
    mockAuthContextWithoutUser()
    const { result } = renderHook(useArtistFavoritesQuery, {
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
