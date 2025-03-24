import type { ReadonlyDeep } from 'type-fest'

import { Artist } from 'features/venue/types'
import { toMutable } from 'shared/types/toMutable'

export const VenueOffersArtistsResponseSnap = toMutable([
  {
    id: '1',
    image: 'url1',
    name: 'Freida McFadden',
  },
  {
    id: '2',
    image: 'url2',
    name: 'Colleen Hoover',
  },
  {
    id: '3',
    image: 'url3',
    name: 'Mercedes Ron',
  },
] as const satisfies ReadonlyDeep<Artist[]>)
