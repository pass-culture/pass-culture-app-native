import {
  FavoriteVenueResponse,
  PaginatedResponseFavoriteVenueResponse,
  VenueResponse,
} from 'api/gen'
import { favoriteVenueResponseSnap } from 'features/favorites/fixtures/favoriteVenueResponseSnap'
import { paginatedVenueFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedVenueFavoritesResponseSnap'
import { UserProfile } from 'features/share/types'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { beneficiaryUser } from 'fixtures/user'
import { EmptyResponse } from 'libs/fetch'
import { mockServer } from 'tests/mswServer'

const venueId = 1

interface Options {
  id?: number
  hasAddFavoriteError?: boolean
  hasTooManyFavorites?: boolean
  hasRemoveFavoriteError?: boolean
}

const defaultOptions = {
  id: venueId,
  hasAddFavoriteError: false,
  hasTooManyFavorites: false,
  hasRemoveFavoriteError: false,
}

export function simulateBackendForVenue(options: Options = defaultOptions) {
  const { id, hasAddFavoriteError, hasRemoveFavoriteError, hasTooManyFavorites } = {
    ...defaultOptions,
    ...options,
  }

  mockServer.getApi<VenueResponse>(`/v2/venue/${venueDataTest.id}`, venueDataTest)
  mockServer.getApi<UserProfile>(`/v1/me`, beneficiaryUser)
  mockServer.getApi<PaginatedResponseFavoriteVenueResponse>(
    `/v2/me/favorites/venues`,
    paginatedVenueFavoritesResponseSnap
  )
  if (hasAddFavoriteError) {
    mockServer.postApi<EmptyResponse>(`/v2/me/favorites/venues`, {
      responseOptions: { statusCode: 422, data: {} },
    })
  } else if (hasTooManyFavorites) {
    mockServer.postApi(`/v2/me/favorites/venues`, {
      responseOptions: { statusCode: 400, data: { code: 'MAX_FAVORITES_REACHED' } },
    })
  } else {
    mockServer.postApi<FavoriteVenueResponse>(`/v2/me/favorites/venues`, {
      responseOptions: { statusCode: 200, data: favoriteVenueResponseSnap },
    })
  }

  const favoriteId = paginatedVenueFavoritesResponseSnap.favorites.find(
    (f) => f.venue.id === id
  )?.id

  if (favoriteId) {
    const responseOptions = hasRemoveFavoriteError
      ? { statusCode: 422, data: {} }
      : { statusCode: 204 }

    mockServer.deleteApi<EmptyResponse>(`/v2/me/favorites/venues/${favoriteId}`, {
      responseOptions,
    })
  }
}
