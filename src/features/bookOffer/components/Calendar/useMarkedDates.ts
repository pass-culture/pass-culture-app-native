import { OfferStockResponse } from 'api/gen'
import { useBooking } from 'features/bookOffer/pages/BookingOfferWrapper'
import {
  formatToKeyDate,
  getDatePrice,
  getDateStatus,
  OfferStatus,
} from 'features/bookOffer/services/utils'

export interface Marking {
  selected: boolean
  price: number | null
  status: OfferStatus
}

export const defaultMarking: Marking = {
  selected: false,
  status: OfferStatus.NOT_OFFERED,
  price: null,
}

interface MarkedDates {
  [key: string]: Marking
}

export const useMarkedDates = (
  stocks: OfferStockResponse[],
  userRemainingCredit: number | null
): MarkedDates => {
  const { bookingState } = useBooking()
  const markedDates: MarkedDates = {}

  stocks.forEach((stock) => {
    if (stock.beginningDatetime === null || stock.beginningDatetime === undefined) return
    const key = formatToKeyDate(new Date(stock.beginningDatetime))
    const selected = bookingState.date ? formatToKeyDate(bookingState.date) === key : false
    const prev = markedDates[key] || defaultMarking

    markedDates[key] = {
      selected: prev.selected || selected,
      price: getDatePrice(prev.price, stock),
      status: getDateStatus(prev.status, stock, userRemainingCredit),
    }
  })

  return markedDates
}
