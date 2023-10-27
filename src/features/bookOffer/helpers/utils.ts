import { OfferStockResponse } from 'api/gen'
import { getTimeZonedDate } from 'libs/parsers'

export enum OfferStatus {
  BOOKABLE = 'BOOKABLE',
  NOT_BOOKABLE = 'NOT_BOOKABLE',
  NOT_OFFERED = 'NOT_OFFERED',
}

export const formatToKeyDate = (dateString: Date | string) => {
  const date = new Date(dateString)
  const day = ('0' + date.getDate()).slice(-2)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}

export const formatHour = (dateString: string | null | undefined, timezone?: string): string => {
  if (!dateString) return ''
  const date = timezone ? getTimeZonedDate(dateString, timezone) : new Date(dateString)
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export const getStatusFromStocks = (stocks: OfferStockResponse[], credit: number): OfferStatus => {
  const bookableStocks = stocks.filter(({ isBookable }) => isBookable)
  if (bookableStocks.length === 0) return OfferStatus.NOT_BOOKABLE
  return bookableStocks.some(({ price }) => price <= credit)
    ? OfferStatus.BOOKABLE
    : OfferStatus.NOT_BOOKABLE
}
