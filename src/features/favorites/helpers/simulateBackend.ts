import { OfferResponse } from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { mockServer } from 'tests/mswServer'

const offerId = 146193

interface Options {
  id?: number
  hasAddFavoriteError?: boolean
  hasTooManyFavorites?: boolean
  hasRemoveFavoriteError?: boolean
}

const defaultOptions = {
  id: offerId,
  hasAddFavoriteError: false,
  hasTooManyFavorites: false,
  hasRemoveFavoriteError: false,
}

export function simulateBackend(options: Options = defaultOptions) {
  const { id, hasAddFavoriteError, hasRemoveFavoriteError, hasTooManyFavorites } = {
    ...defaultOptions,
    ...options,
  }
  const offerFavId = paginatedFavoritesResponseSnap.favorites.find((f) => f.offer.id === id)?.id

  mockServer.getAPIV1<OfferResponse>(`/native/v1/offer/${id}`, offerResponseSnap)
  if (hasTooManyFavorites) {
    mockServer.postAPIV1('/native/v1/me/favorites', {
      responseOptions: { statusCode: 400, data: { code: 'MAX_FAVORITES_REACHED' } },
    })
  } else if (hasAddFavoriteError) {
    mockServer.postAPIV1('/native/v1/me/favorites', { responseOptions: { statusCode: 422 } })
  } else {
    mockServer.postAPIV1('/native/v1/me/favorites', favoriteResponseSnap)
  }
  if (hasRemoveFavoriteError) {
    mockServer.deleteAPIV1(`/native/v1/me/favorites/${offerFavId}`, {
      responseOptions: { statusCode: 422 },
    })
  } else {
    mockServer.deleteAPIV1(`/native/v1/me/favorites/${offerFavId}`, {})
  }
}
