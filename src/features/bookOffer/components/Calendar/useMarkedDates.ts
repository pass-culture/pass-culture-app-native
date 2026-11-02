import { groupBy } from 'lodash'

import { OfferStockResponse } from 'api/gen'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { formatToKeyDate, getStatusFromStocks, OfferStatus } from 'features/bookOffer/helpers/utils'
import { getOfferPrice } from 'features/offer/helpers/getOfferPrice/getOfferPrice'

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

export interface MarkedDates {
  [key: string]: Marking
}

export const useMarkedDates = (
  stocks: OfferStockResponse[],
  userRemainingCredit: number,
  selectedDate?: Date | null
): MarkedDates => {
  const { bookingState } = useBookingContext()
  const date = selectedDate === undefined ? bookingState.date : selectedDate
  const markedDates: MarkedDates = {}

  const groupedByDates = groupBy(
    stocks.filter(({ beginningDatetime: start }) => start !== undefined && start !== null),
    (stock) => formatToKeyDate(stock.beginningDatetime as string)
  )

  Object.entries(groupedByDates).forEach(([key, groupedStocks]) => {
    const selected = date ? formatToKeyDate(date) === key : false

    markedDates[key] = {
      selected,
      price: getOfferPrice(groupedStocks),
      status: getStatusFromStocks(groupedStocks, userRemainingCredit),
    }
  })

  return markedDates
}
