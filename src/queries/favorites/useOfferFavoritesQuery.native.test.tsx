import React from 'react'
import { View } from 'react-native'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { paginatedOfferFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedOfferFavoritesResponseSnap'
import { simulateBackendForOffer } from 'features/favorites/tests/simulateBackendForOffer'
import { useOfferFavoritesQuery } from 'queries/favorites/useFavoritesQuery'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

const renderUseOfferFavoritesQuery = (options = {}) =>
  renderHook(() => useOfferFavoritesQuery(options), {
    wrapper: (props) =>
      reactQueryProviderHOC(
        <FavoritesWrapper>
          <View>{props.children}</View>
        </FavoritesWrapper>
      ),
  })

describe('useOfferFavoritesQuery hook', () => {
  it('should retrieve favorite data when logged in', async () => {
    simulateBackendForOffer()
    const { result } = renderUseOfferFavoritesQuery()

    await waitFor(() => expect(result.current.isFetched).toEqual(true))

    expect(result.current.data?.favorites.length).toEqual(
      paginatedOfferFavoritesResponseSnap.favorites.length
    )
  })

  it('should fail to fetch when not logged in', () => {
    mockAuthContextWithoutUser()
    const { result } = renderUseOfferFavoritesQuery()

    expect(result.current.isFetching).toEqual(false)
  })
})
