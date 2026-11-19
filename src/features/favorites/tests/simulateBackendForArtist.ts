import {
  ArtistResponse,
  FavoriteArtistResponse,
  PaginatedResponseFavoriteArtistResponse,
} from 'api/gen'
import { mockArtist } from 'features/artist/fixtures/mockArtist'
import { favoriteArtistResponseSnap } from 'features/favorites/fixtures/favoriteArtistResponseSnap'
import { paginatedArtistFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedArtistFavoritesResponseSnap'
import { UserProfile } from 'features/share/types'
import { beneficiaryUser } from 'fixtures/user'
import { EmptyResponse } from 'libs/fetch'
import { mockServer } from 'tests/mswServer'

const artistId = mockArtist.id

interface Options {
  id?: string
  hasAddFavoriteError?: boolean
  hasTooManyFavorites?: boolean
  hasRemoveFavoriteError?: boolean
}

const defaultOptions = {
  id: artistId,
  hasAddFavoriteError: false,
  hasTooManyFavorites: false,
  hasRemoveFavoriteError: false,
}

export function simulateBackendForArtist(options: Options = defaultOptions) {
  const { id, hasAddFavoriteError, hasRemoveFavoriteError, hasTooManyFavorites } = {
    ...defaultOptions,
    ...options,
  }

  mockServer.getApi<ArtistResponse>(`/v1/artists/${id}`, mockArtist)
  mockServer.getApi<UserProfile>(`/v1/me`, beneficiaryUser)
  mockServer.getApi<PaginatedResponseFavoriteArtistResponse>(
    `/v2/me/favorites/artists`,
    paginatedArtistFavoritesResponseSnap
  )
  if (hasAddFavoriteError) {
    mockServer.postApi<EmptyResponse>(`/v2/me/favorites/artists`, {
      responseOptions: { statusCode: 422, data: {} },
    })
  } else if (hasTooManyFavorites) {
    mockServer.postApi(`/v2/me/favorites/artists`, {
      responseOptions: { statusCode: 400, data: { code: 'MAX_FAVORITES_REACHED' } },
    })
  } else {
    mockServer.postApi<FavoriteArtistResponse>(`/v2/me/favorites/artists`, {
      responseOptions: { statusCode: 200, data: favoriteArtistResponseSnap },
    })
  }

  const favoriteId = paginatedArtistFavoritesResponseSnap.favorites.find(
    (f) => f.artist.id === id
  )?.id

  if (favoriteId) {
    const responseOptions = hasRemoveFavoriteError
      ? { statusCode: 422, data: {} }
      : { statusCode: 204 }

    mockServer.deleteApi<EmptyResponse>(`/v2/me/favorites/artists/${favoriteId}`, {
      responseOptions,
    })
  }
}
