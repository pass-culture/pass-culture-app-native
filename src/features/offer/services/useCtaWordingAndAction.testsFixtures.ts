import { OfferStockResponse } from 'api/gen'

export const notExpiredStock: OfferStockResponse = {
  id: 118929,
  beginningDatetime: new Date('2021-01-01T13:30:00'),
  bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
  price: 500,
  isBookable: true,
  isExpired: false,
  isSoldOut: false,
}
