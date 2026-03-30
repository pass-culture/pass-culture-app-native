import type { ReadonlyDeep } from 'type-fest'

import { OfferProAdvice, OfferProAdvices } from 'api/gen'

export const proAdvicesFixture = [
  {
    author: 'Arthur',
    content:
      'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
    venueId: 1,
    venueName: 'The Best Place',
    publicationDatetime: '09/03/2026',
    venueThumbUrl: 'url',
  },
  {
    author: 'Bérangère',
    content:
      'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
    venueId: 2,
    venueName: 'The Amazing Place',
    publicationDatetime: '09/03/2026',
  },
] as const satisfies readonly OfferProAdvice[]

export const offerProAdvicesFixture = {
  proAdvices: proAdvicesFixture,
  nbResults: 2,
} as const satisfies ReadonlyDeep<OfferProAdvices>
