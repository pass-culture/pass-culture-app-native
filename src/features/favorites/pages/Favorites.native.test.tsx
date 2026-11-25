import React from 'react'

import {
  PaginatedResponseFavoriteArtistResponse,
  PaginatedResponseFavoriteOfferResponseV2,
  PaginatedResponseFavoriteVenueResponse,
} from 'api/gen'
import { initialFavoritesState as mockInitialFavoritesState } from 'features/favorites/context/reducer'
import { paginatedArtistFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedArtistFavoritesResponseSnap'
import { paginatedOfferFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedOfferFavoritesResponseSnap'
import { paginatedVenueFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedVenueFavoritesResponseSnap'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { Favorites } from './Favorites'

jest.mock('queries/subcategories/useSubcategoriesQuery')

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock
jest.mock('libs/jwt/jwt')

jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockInitialFavoritesState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('features/auth/context/AuthContext')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<Favorites/>', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockUseNetInfoContext.mockReturnValue({ isConnected: true })
  })

  it('should render correctly', async () => {
    mockServer.getApi<PaginatedResponseFavoriteOfferResponseV2>(
      '/v2/me/favorites/offers',
      paginatedOfferFavoritesResponseSnap
    )
    mockServer.getApi<PaginatedResponseFavoriteArtistResponse>(
      '/v2/me/favorites/artists',
      paginatedArtistFavoritesResponseSnap
    )
    mockServer.getApi<PaginatedResponseFavoriteVenueResponse>(
      '/v2/me/favorites/venues',
      paginatedVenueFavoritesResponseSnap
    )
    render(reactQueryProviderHOC(<Favorites />))

    await screen.findByText('Mes favoris')

    expect(screen).toMatchSnapshot()
  })

  it('should render non connected view with page header when not logged in', async () => {
    mockAuthContextWithoutUser()
    render(reactQueryProviderHOC(<Favorites />))

    expect(await screen.findByText('Mes favoris')).toBeOnTheScreen()
    expect(screen.getByText('Identifie-toi pour retrouver tes favoris')).toBeOnTheScreen()
  })

  it('should render non connected view inside tabs when favorites hub is enabled and user is not logged in', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_FAVORITES_HUB])
    mockAuthContextWithoutUser()
    render(reactQueryProviderHOC(<Favorites />))

    expect(await screen.findByText('Mes favoris')).toBeOnTheScreen()
    expect(screen.getByLabelText('Types de favoris')).toBeOnTheScreen()
    expect(screen.getByText('Identifie-toi pour retrouver tes favoris')).toBeOnTheScreen()
  })

  it('should render offline page when not connected', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })

    render(reactQueryProviderHOC(<Favorites />))

    expect(await screen.findByText('Oups, pas de réseau !')).toBeOnTheScreen()
  })
})
