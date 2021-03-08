import { OfferStockResponse } from 'api/gen'

export enum OfferStatus {
  BOOKABLE = 'BOOKABLE',
  NOT_BOOKABLE = 'NOT_BOOKABLE',
  NOT_OFFERED = 'NOT_OFFERED',
}

export const formatToKeyDate = (date: Date) => {
  const day = ('0' + date.getDate()).slice(-2)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}

export const getStatusFromStockAndCredit = (
  stock: OfferStockResponse,
  credit: number | null
): OfferStatus => {
  const hasEnoughCredit = typeof credit === 'number' ? credit >= stock.price : false
  const hasStockExpired = stock.bookingLimitDatetime
    ? stock.bookingLimitDatetime < new Date()
    : false

  if (stock.isBookable && hasEnoughCredit && !hasStockExpired) return OfferStatus.BOOKABLE

  return OfferStatus.NOT_BOOKABLE
}

export const getDateStatus = (
  previousStatus: OfferStatus,
  stock: OfferStockResponse,
  credit: number | null
): OfferStatus =>
  previousStatus === OfferStatus.BOOKABLE
    ? OfferStatus.BOOKABLE
    : getStatusFromStockAndCredit(stock, credit)

export const getDatePrice = (
  previousPrice: number | null,
  stock: OfferStockResponse
): number | null => {
  const possiblePrices = []
  if (typeof previousPrice === 'number') possiblePrices.push(previousPrice)
  if (typeof stock.price === 'number') possiblePrices.push(stock.price)

  return possiblePrices.length > 0 ? Math.min(...possiblePrices) : null
}
