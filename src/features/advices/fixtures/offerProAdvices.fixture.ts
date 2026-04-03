import type { ReadonlyDeep } from 'type-fest'

import { OfferProAdvice, OfferProAdvices } from 'api/gen'
import { AdviceCardData } from 'features/advices/types'
import { TagVariant } from 'ui/designSystem/Tag/types'

export const proAdvicesFixture = [
  {
    author: 'Arthur',
    content:
      'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
    venueId: 1,
    venueName: 'The Best Place',
    publicationDatetime: '09/03/2026',
    venueThumbUrl: 'url',
    distance: 500,
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

export const offerProAdvicesCardDataFixture = [
  {
    id: 1,
    title: 'The Best Place',
    subtitle: 'à 500 m',
    description:
      'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
    date: 'Septembre 2026',
    tagProps: { variant: TagVariant.PROEDITO, label: 'par Arthur' },
    image: 'url',
    headerNavigateTo: { screen: 'Venue' },
    headerAccessibilityLabel: 'Voir le lieu The Best Place',
  },
  {
    id: 2,
    title: 'The Amazing Place',
    subtitle: '',
    description:
      'Ce livre est vraiment exceptionnel\u00a0! Vous serez tenu en haleine du début à la fin\u00a0! Préparez-vous à être surpris et a totalement adhéré à l‘écriture de cet auteur\u00a0! ',
    date: 'Septembre 2026',
    tagProps: { variant: TagVariant.PROEDITO, label: 'par Bérangère' },
    image: undefined,
    headerNavigateTo: { screen: 'Venue' },
    headerAccessibilityLabel: 'Voir le lieu The Amazing Place',
  },
] as const satisfies readonly AdviceCardData[]
