import type { ReadonlyDeep } from 'type-fest'

import { GetAvailableReactionsResponse, SubcategoryIdEnum } from 'api/gen'
import { toMutable } from 'shared/types/toMutable'

export const availableReactionsSnap = toMutable({
  numberOfReactableBookings: 2,
  bookings: [
    {
      name: 'Avez-vous déjà vu\u00a0?',
      offerId: 147875,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      image: null,
      dateUsed: '2021-03-15T23:01:37.925926',
    },
    {
      name: 'Product 6',
      offerId: 7,
      subcategoryId: 'LIVRE_PAPIER',
      image: null,
      dateUsed: '2024-12-23T14:09:21.057979Z',
    },
  ],
}) satisfies ReadonlyDeep<GetAvailableReactionsResponse>
