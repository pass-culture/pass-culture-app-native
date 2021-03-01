import { OfferStockResponse } from 'api/gen'
import { getOfferPrice } from 'features/offer/services/getOfferPrice'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { formatToFrenchDecimal } from 'libs/parsers'

export const getStocksByDate = (
  stocks: OfferStockResponse[]
): { [date: string]: OfferStockResponse[] } => {
  const stockDates: { [date: string]: OfferStockResponse[] } = {}

  stocks.forEach((stock) => {
    if (stock.beginningDatetime !== null && stock.beginningDatetime !== undefined) {
      const formattedDate = formatToSlashedFrenchDate(stock.beginningDatetime.toString())
      stockDates[formattedDate] = stockDates[formattedDate]
        ? stockDates[formattedDate].concat(stock)
        : [stock]
    }
  })

  return stockDates
}

export enum OfferStatus {
  BOOKABLE = 'BOOKABLE',
  NOT_BOOKABLE = 'NOT_BOOKABLE',
  NOT_OFFERED = 'NOT_OFFERED',
}

export const getDateStatusAndPrice = (
  date: Date,
  stocksDates: { [date: string]: OfferStockResponse[] },
  userRemainingCredit: number | null
): { status: OfferStatus; price: string | null } => {
  const stocksByDate = stocksDates[formatToSlashedFrenchDate(date.toString())]
  if (!stocksByDate) return { status: OfferStatus.NOT_OFFERED, price: null }

  const price = getOfferPrice(stocksByDate)
  const offerIsBookable = stocksByDate.some((stock) => stock.isBookable)
  const hasEnoughCredit = userRemainingCredit ? userRemainingCredit > price : false
  const formattedPrice = formatToFrenchDecimal(price).replace(' ', '')

  if (offerIsBookable && hasEnoughCredit)
    return { status: OfferStatus.BOOKABLE, price: formattedPrice }
  return { status: OfferStatus.NOT_BOOKABLE, price: formattedPrice }
}
