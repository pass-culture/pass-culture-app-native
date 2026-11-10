import {
  FavoriteOfferResponseV2,
  OfferResponse,
  PaginatedResponseFavoriteOfferResponseV2,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { paginatedOfferFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedOfferFavoritesResponseSnap'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { UserProfile } from 'features/share/types'
import { beneficiaryUser } from 'fixtures/user'
import { EmptyResponse } from 'libs/fetch'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
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

export function simulateBackendForOffer(options: Options = defaultOptions) {
  const { id, hasAddFavoriteError, hasRemoveFavoriteError, hasTooManyFavorites } = {
    ...defaultOptions,
    ...options,
  }

  mockServer.getApi<OfferResponse>(`/v3/offer/${id}`, offerResponseSnap)
  mockServer.getApi<UserProfile>(`/v1/me`, beneficiaryUser)
  mockServer.getApi<PaginatedResponseFavoriteOfferResponseV2>(
    `/v2/me/favorites/offers`,
    paginatedOfferFavoritesResponseSnap
  )
  mockServer.getApi<SubcategoriesResponseModelv2>(`/v1/subcategories/v2`, subcategoriesDataTest)
  if (hasAddFavoriteError) {
    mockServer.postApi<EmptyResponse>(`/v2/me/favorites/offers`, {
      responseOptions: { statusCode: 422, data: {} },
    })
  } else if (hasTooManyFavorites) {
    mockServer.postApi(`/v2/me/favorites/offers`, {
      responseOptions: { statusCode: 400, data: { code: 'MAX_FAVORITES_REACHED' } },
    })
  } else {
    mockServer.postApi<FavoriteOfferResponseV2>(`/v2/me/favorites/offers`, {
      responseOptions: { statusCode: 200, data: favoriteResponseSnap },
    })
  }

  const favoriteId = paginatedOfferFavoritesResponseSnap.favorites.find(
    (f) => f.offer.id === id
  )?.id

  if (favoriteId) {
    const responseOptions = hasRemoveFavoriteError
      ? { statusCode: 422, data: {} }
      : { statusCode: 204 }

    mockServer.deleteApi<EmptyResponse>(`/v2/me/favorites/offers/${favoriteId}`, {
      responseOptions,
    })
  }
}
