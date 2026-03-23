import type { ReadonlyDeep } from 'type-fest'

import { VenueProAdvice, VenueProAdvices } from 'api/gen'
import { AdviceCardData } from 'features/advices/types'
import { TagVariant } from 'ui/designSystem/Tag/types'

export const proAdvicesFixture = [
  {
    author: 'Arthur',
    content:
      'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
    offerId: 1,
    offerName: 'American dream',
    offerCategoryLabel: 'Livre',
    publicationDatetime: '09/03/2026',
    offerThumbUrl: 'url',
  },
  {
    author: 'Bérangère',
    content:
      'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
    offerId: 1,
    offerName: 'American dream',
    offerCategoryLabel: 'Livre',
    publicationDatetime: '09/03/2026',
  },
] as const satisfies readonly VenueProAdvice[]

export const venueProAdvicesFixture = {
  proAdvices: proAdvicesFixture,
  nbResults: 2,
} as const satisfies ReadonlyDeep<VenueProAdvices>

export const proAdvicesCardDataFixture = [
  {
    id: 1,
    title: 'American dream',
    subtitle: 'Livre',
    description:
      'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
    date: 'Septembre 2026',
    tagProps: { variant: TagVariant.PROEDITO, label: 'par Arthur' },
    image: 'url',
    headerNavigateTo: { screen: 'Offer', params: { id: 1 } },
    headerAccessibilityLabel: 'Voir l‘offre American dream',
  },
  {
    id: 1,
    title: 'American dream',
    subtitle: 'Livre',
    description:
      'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
    date: 'Septembre 2026',
    tagProps: { variant: TagVariant.PROEDITO, label: 'par Bérangère' },
    headerNavigateTo: { screen: 'Offer', params: { id: 1 } },
    headerAccessibilityLabel: 'Voir l‘offre American dream',
  },
] as const satisfies readonly AdviceCardData[]
