import { OfferStockResponse } from 'api/gen'
import { storage } from 'libs/storage'

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

export const formatHour = (dateString: Date | null | undefined): string => {
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

export const getTimesReviewHasBeenRequested = async () => {
  // read the value in storage
  const timesReviewHasBeenRequested = await storage.readObject('times_review_has_been_requested')
  // if it exists return the value
  if (timesReviewHasBeenRequested) {
    return timesReviewHasBeenRequested
  } else {
    // sinon on initialise à 0
    storage.saveObject('times_review_has_been_requested', 0)
    return 0
  }
}

export const getFirstTimeReviewHasBeenRequestedDate = async () => {
  // read the value in storage
  const firstTimeReviewHasBeenRequestedDate = await storage.readObject(
    'first_time_review_has_been_requested_date'
  )
  // if it exists return the value
  if (firstTimeReviewHasBeenRequestedDate) {
    return firstTimeReviewHasBeenRequestedDate
  } else {
    // sinon on initialise à undefined
    storage.saveObject('first_time_review_has_been_requested_date', undefined)
    return undefined
  }
}
