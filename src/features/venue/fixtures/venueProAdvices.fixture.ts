import type { ReadonlyDeep } from 'type-fest'

import { SubcategoryIdEnum, VenueProAdvice, VenueProAdvices } from 'api/gen'

export const proAdvicesFixture = [
  {
    author: 'Arthur',
    content:
      'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
    offerId: 1,
    offerName: 'American dream',
    offerSubcategory: SubcategoryIdEnum.LIVRE_PAPIER,
    publicationDatetime: '09/03/2026',
  },
  {
    author: 'Bérangère',
    content:
      'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
    offerId: 1,
    offerName: 'American dream',
    offerSubcategory: SubcategoryIdEnum.LIVRE_PAPIER,
    publicationDatetime: '09/03/2026',
  },
] as const satisfies readonly VenueProAdvice[]

export const venueProAdvicesFixture = {
  proAdvices: proAdvicesFixture,
  nbResults: 2,
} as const satisfies ReadonlyDeep<VenueProAdvices>
