import React from 'react'
import { View } from 'react-native'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { paginatedArtistFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedArtistFavoritesResponseSnap'
import { selectArtistFavorite } from 'features/favorites/helpers/selectArtistFavorite'
import { useArtistFavoritesQuery } from 'features/favorites/queries/useArtistFavoritesQuery'
import { simulateBackendForArtist } from 'features/favorites/tests/simulateBackendForArtist'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

const renderUseArtistFavoritesQuery = (options = {}) =>
  renderHook(() => useArtistFavoritesQuery(options), {
    wrapper: (props) =>
      reactQueryProviderHOC(
        <FavoritesWrapper>
          <View>{props.children}</View>
        </FavoritesWrapper>
      ),
  })

describe('useArtistFavoritesQuery hook', () => {
  it('should retrieve favorite data when logged in by default', async () => {
    simulateBackendForArtist()
    const { result } = renderUseArtistFavoritesQuery()

    await waitFor(() => expect(result.current.isFetched).toEqual(true))

    expect(result.current.data?.favorites.length).toEqual(
      paginatedArtistFavoritesResponseSnap.favorites.length
    )
  })

  it('should not fetch when not logged in', () => {
    mockAuthContextWithoutUser()
    const { result } = renderUseArtistFavoritesQuery()

    expect(result.current.isFetching).toEqual(false)
    expect(result.current.isFetched).toEqual(false)
  })

  it('should not fetch when enabled is false', () => {
    simulateBackendForArtist()
    const { result } = renderUseArtistFavoritesQuery({ enabled: false })

    expect(result.current.isFetching).toEqual(false)
    expect(result.current.isFetched).toEqual(false)
  })

  it('should transform data when select option is passed', async () => {
    simulateBackendForArtist()
    const targetFavorite = paginatedArtistFavoritesResponseSnap.favorites[0]
    const targetArtistId = targetFavorite?.artist.id

    const { result } = renderUseArtistFavoritesQuery({
      select: (data) => selectArtistFavorite(data, targetArtistId),
    })

    await waitFor(() => expect(result.current.isFetched).toEqual(true))

    expect(result.current.data).toEqual(targetFavorite)
  })
})
