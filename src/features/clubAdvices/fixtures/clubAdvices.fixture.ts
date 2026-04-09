import type { ReadonlyDeep } from 'type-fest'

import { OfferChronicle, OfferChronicles } from 'api/gen'

export const clubAdvicesFixture = [
  {
    id: 31,
    dateCreated: '2025-01-20T23:32:14.456451Z',
    author: {
      firstName: null,
      age: 15,
      city: 'Paris',
    },
    content: 'Chronique sur le produit Product 30 mais sans utilisateur.',
  },
  {
    id: 1,
    dateCreated: '2025-01-20T23:32:13.978038Z',
    author: {
      firstName: 'Jeanne',
      age: 15,
      city: 'Paris',
    },
    content: 'Chronique sur le produit Product 30 \u00e9crite par l’utilisateur Jeanne Doux (2).',
  },
] as const satisfies readonly OfferChronicle[]

export const offerClubAdvicesFixture = {
  chronicles: clubAdvicesFixture,
} as const satisfies ReadonlyDeep<OfferChronicles>
