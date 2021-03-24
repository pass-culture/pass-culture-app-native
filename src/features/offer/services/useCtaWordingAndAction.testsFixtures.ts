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

const notExpiredStockNoLimitDate: OfferStockResponse = {
  id: 118928,
  beginningDatetime: new Date('2021-01-02T18:00:00'),
  price: 500,
  isBookable: true,
  isExpired: false,
  isSoldOut: false,
}

export const expiredStock1: OfferStockResponse = {
  id: 118929,
  beginningDatetime: new Date('2021-01-01T13:30:00'),
  bookingLimitDatetime: new Date('2021-01-03T13:30:00'),
  price: 500,
  isBookable: true,
  isExpired: false,
  isSoldOut: false,
}
export const expiredStock2: OfferStockResponse = {
  id: 118928,
  beginningDatetime: new Date('2021-01-02T18:00:00'),
  bookingLimitDatetime: new Date('2021-01-03T13:30:00'),
  price: 500,
  isBookable: true,
  isExpired: false,
  isSoldOut: false,
}

export const soldOutStock: OfferStockResponse = {
  id: 118929,
  beginningDatetime: new Date('2021-01-01T13:30:00'),
  bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
  price: 500,
  isBookable: false,
  isExpired: false,
  isSoldOut: false,
}

const notSoldOutStock: OfferStockResponse = {
  id: 118929,
  beginningDatetime: new Date('2021-01-01T13:30:00'),
  bookingLimitDatetime: new Date('2021-01-05T13:30:00'),
  price: 500,
  isBookable: true,
  isExpired: false,
  isSoldOut: false,
}

export const expiredOffer = {
  stocks: [expiredStock1, expiredStock2],
}

export const notExpiredOffer = {
  stocks: [notExpiredStock, expiredStock2],
}

export const notExpiredOfferNoLimitDate = {
  stocks: [expiredStock1, notExpiredStockNoLimitDate],
}

export const soldOutOffer = {
  stocks: [soldOutStock],
}

export const notSoldOutOffer = {
  stocks: [soldOutStock, notSoldOutStock],
}
