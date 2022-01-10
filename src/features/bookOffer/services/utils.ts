import { OfferStockResponse } from 'api/gen'

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

export const formatHour = (dateString: string | null | undefined): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const hours = date.getHours()
  const minutes = ('0' + date.getMinutes()).slice(-2)
  return `${hours}:${minutes}`
}

export const getStatusFromStocks = (stocks: OfferStockResponse[], credit: number): OfferStatus => {
  const bookableStocks = stocks.filter(({ isBookable }) => isBookable)
  if (bookableStocks.length === 0) return OfferStatus.NOT_BOOKABLE
  return bookableStocks.some(({ price }) => price <= credit)
    ? OfferStatus.BOOKABLE
    : OfferStatus.NOT_BOOKABLE
}
