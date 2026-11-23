import React from 'react'
import { View } from 'react-native'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { paginatedVenueFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedVenueFavoritesResponseSnap'
import { selectVenueFavorite } from 'features/favorites/helpers/selectVenueFavorite'
import { simulateBackendForVenue } from 'features/favorites/tests/simulateBackendForVenue'
import { useVenueFavoritesQuery } from 'queries/favorites/useFavoritesQuery'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

const renderUseVenueFavoritesQuery = (options = {}) =>
  renderHook(() => useVenueFavoritesQuery(options), {
    wrapper: (props) =>
      reactQueryProviderHOC(
        <FavoritesWrapper>
          <View>{props.children}</View>
        </FavoritesWrapper>
      ),
  })

describe('useVenueFavoritesQuery hook', () => {
  it('should retrieve favorite data when logged in by default', async () => {
    simulateBackendForVenue()
    const { result } = renderUseVenueFavoritesQuery()

    await waitFor(() => expect(result.current.isFetched).toEqual(true))

    expect(result.current.data?.favorites.length).toEqual(
      paginatedVenueFavoritesResponseSnap.favorites.length
    )
  })

  it('should not fetch when not logged in', () => {
    mockAuthContextWithoutUser()
    const { result } = renderUseVenueFavoritesQuery()

    expect(result.current.isFetching).toEqual(false)
    expect(result.current.isFetched).toEqual(false)
  })

  it('should not fetch when enabled is false', () => {
    simulateBackendForVenue()
    const { result } = renderUseVenueFavoritesQuery({ enabled: false })

    expect(result.current.isFetching).toEqual(false)
    expect(result.current.isFetched).toEqual(false)
  })

  it('should transform data when select option is passed', async () => {
    simulateBackendForVenue()
    const targetFavorite = paginatedVenueFavoritesResponseSnap.favorites[0]
    const targetVenueId = targetFavorite.venue.id

    const { result } = renderUseVenueFavoritesQuery({
      select: (data) => selectVenueFavorite(data, targetVenueId),
    })

    await waitFor(() => expect(result.current.isFetched).toEqual(true))

    expect(result.current.data).toEqual(targetFavorite)
  })
})
