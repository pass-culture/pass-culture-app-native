import { isAfter } from 'date-fns'

import { OfferResponseV2 } from 'api/gen'

export const getIsAComingSoonOffer = (offer: OfferResponseV2): boolean =>
  !offer.isReleased &&
  !!offer.publicationDate &&
  isAfter(new Date(offer.publicationDate), new Date())
