import React from 'react'
import { View } from 'react-native'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { paginatedOfferFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedOfferFavoritesResponseSnap'
import { useOfferFavoritesQuery } from 'features/favorites/queries/useOfferFavoritesQuery'
import { simulateBackendForOffer } from 'features/favorites/tests/simulateBackendForOffer'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

describe('useOfferFavoritesQuery hook', () => {
  it('should retrieve favorite data when logged in', async () => {
    simulateBackendForOffer()
    const { result } = renderHook(useOfferFavoritesQuery, {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    await waitFor(() => expect(result.current.isFetched).toEqual(true))

    expect(result.current.data?.favorites.length).toEqual(
      paginatedOfferFavoritesResponseSnap.favorites.length
    )
  })

  it('should fail to fetch when not logged in', async () => {
    mockAuthContextWithoutUser()
    const { result } = renderHook(useOfferFavoritesQuery, {
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
