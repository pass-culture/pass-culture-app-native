// eslint-disable-next-line import/no-extraneous-dependencies

import {
  FavoriteResponse,
  OfferResponse,
  PaginatedFavoritesResponse,
  UserProfileResponse,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { beneficiaryUser } from 'fixtures/user'
import { EmptyResponse } from 'libs/fetch'
import { placeholderData } from 'libs/subcategories/placeholderData'
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

  mockServer.getApiV1<OfferResponse>(`/offer/${id}`, offerResponseSnap)
  mockServer.getApiV1<UserProfileResponse>(`/me`, beneficiaryUser)
  mockServer.getApiV1<PaginatedFavoritesResponse>(`/me/favorites`, paginatedFavoritesResponseSnap)
  mockServer.getApiV1<SubcategoriesResponseModelv2>(`/subcategories/v2`, { ...placeholderData })
  if (hasAddFavoriteError) {
    mockServer.postApiV1<EmptyResponse>(`/me/favorites`, {
      responseOptions: { statusCode: 422, data: {} },
    })
  } else if (hasTooManyFavorites) {
    mockServer.postApiV1(`/me/favorites`, {
      responseOptions: { statusCode: 400, data: { code: 'MAX_FAVORITES_REACHED' } },
    })
  } else {
    mockServer.postApiV1<FavoriteResponse>(`/me/favorites`, {
      responseOptions: { statusCode: 200, data: favoriteResponseSnap },
    })
  }

  !hasRemoveFavoriteError
    ? mockServer.deleteApiV1<EmptyResponse>(
        `/me/favorites/${
          paginatedFavoritesResponseSnap.favorites.find((f) => f.offer.id === id)?.id
        }`,
        {
          responseOptions: { statusCode: 204 },
        }
      )
    : mockServer.deleteApiV1<EmptyResponse>(
        `/me/favorites/${
          paginatedFavoritesResponseSnap.favorites.find((f) => f.offer.id === id)?.id
        }`,
        {
          responseOptions: { statusCode: 422, data: {} },
        }
      )
}
