// eslint-disable-next-line import/no-extraneous-dependencies

import {
  FavoriteResponse,
  OfferResponseV2,
  PaginatedFavoritesResponse,
  UserProfileResponse,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { beneficiaryUser } from 'fixtures/user'
import { EmptyResponse } from 'libs/fetch'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
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

  mockServer.getApi<OfferResponseV2>(`/v2/offer/${id}`, offerResponseSnap)
  mockServer.getApi<UserProfileResponse>(`/v1/me`, beneficiaryUser)
  mockServer.getApi<PaginatedFavoritesResponse>(`/v1/me/favorites`, paginatedFavoritesResponseSnap)
  mockServer.getApi<SubcategoriesResponseModelv2>(`/v1/subcategories/v2`, { ...PLACEHOLDER_DATA })
  if (hasAddFavoriteError) {
    mockServer.postApi<EmptyResponse>(`/v1/me/favorites`, {
      responseOptions: { statusCode: 422, data: {} },
    })
  } else if (hasTooManyFavorites) {
    mockServer.postApi(`/v1/me/favorites`, {
      responseOptions: { statusCode: 400, data: { code: 'MAX_FAVORITES_REACHED' } },
    })
  } else {
    mockServer.postApi<FavoriteResponse>(`/v1/me/favorites`, {
      responseOptions: { statusCode: 200, data: favoriteResponseSnap },
    })
  }

  if (hasRemoveFavoriteError) {
    mockServer.deleteApi<EmptyResponse>(
      `/v1/me/favorites/${
        paginatedFavoritesResponseSnap.favorites.find((f) => f.offer.id === id)?.id
      }`,
      {
        responseOptions: { statusCode: 422, data: {} },
      }
    )
  } else {
    mockServer.deleteApi<EmptyResponse>(
      `/v1/me/favorites/${
        paginatedFavoritesResponseSnap.favorites.find((f) => f.offer.id === id)?.id
      }`,
      {
        responseOptions: { statusCode: 204 },
      }
    )
  }
}
