import type { ReadonlyDeep } from 'type-fest'

import { PaginatedResponseFavoriteArtistResponse } from 'api/gen'
import { mockArtist, mockArtistLadyGaga } from 'features/artist/fixtures/mockArtist'
import { toMutable } from 'shared/types/toMutable'

// humanizedId AHD3A
export const paginatedArtistFavoritesResponseSnap = toMutable({
  page: 1,
  nbFavorites: 2,
  favorites: [
    {
      id: 480,
      artist: mockArtist,
    },
    {
      id: 481,
      artist: mockArtistLadyGaga,
    },
  ],
} as const satisfies ReadonlyDeep<PaginatedResponseFavoriteArtistResponse>)
