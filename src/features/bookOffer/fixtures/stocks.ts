import { OfferStockResponse } from 'api/gen'

export const stock1: OfferStockResponse = {
  activationCode: null,
  beginningDatetime: '2023-04-01T20:00:00Z',
  bookingLimitDatetime: '2023-04-01T20:00:00Z',
  cancellationLimitDatetime: '2023-03-08T11:35:34.283195Z',
  id: 18758,
  isBookable: true,
  isExpired: false,
  isForbiddenToUnderage: false,
  isSoldOut: false,
  price: 21000,
  priceCategoryLabel: 'Tribune présidentielle',
  remainingQuantity: 200,
}

export const stock2: OfferStockResponse = {
  activationCode: null,
  beginningDatetime: '2023-04-01T18:00:00Z',
  bookingLimitDatetime: '2023-04-01T18:00:00Z',
  cancellationLimitDatetime: '2023-03-08T11:35:34.283195Z',
  id: 18757,
  isBookable: true,
  isExpired: false,
  isForbiddenToUnderage: false,
  isSoldOut: false,
  price: 22000,
  priceCategoryLabel: 'Pelouse or',
  remainingQuantity: 200,
}

export const stock3: OfferStockResponse = {
  activationCode: null,
  beginningDatetime: '2023-04-01T18:00:00Z',
  bookingLimitDatetime: '2023-04-01T18:00:00Z',
  cancellationLimitDatetime: '2023-03-08T11:35:34.283195Z',
  id: 18756,
  isBookable: true,
  isExpired: false,
  isForbiddenToUnderage: false,
  isSoldOut: false,
  price: 10000,
  priceCategoryLabel: 'Pelouse',
  remainingQuantity: 200,
}

export const mockStocks = [stock1, stock2, stock3]
