import type { ReadonlyDeep } from 'type-fest'

import { PaginatedResponseFavoriteVenueResponse } from 'api/gen'
import { toMutable } from 'shared/types/toMutable'

export const paginatedVenueFavoritesResponseSnap = toMutable({
  page: 1,
  nbFavorites: 2,
  favorites: [
    {
      id: 480,
      venue: { id: 5543, image: 'image1', name: 'Le Petit Rintintin 1' },
    },
    {
      id: 481,
      venue: { id: 2, image: 'image2', name: 'Lieu 2' },
    },
  ],
} as const satisfies ReadonlyDeep<PaginatedResponseFavoriteVenueResponse>)
