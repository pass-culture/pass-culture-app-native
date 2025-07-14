import { isAfter } from 'date-fns'

import { OfferResponseV2 } from 'api/gen'

export const getIsAComingSoonOffer = (offer: OfferResponseV2): boolean =>
  !offer.isReleased &&
  !!offer.bookingAllowedDatetime &&
  isAfter(new Date(offer.bookingAllowedDatetime), new Date())
