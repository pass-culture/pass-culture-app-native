import { OfferStockResponse } from 'api/gen'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { CENTS_IN_EURO } from 'libs/parsers/pricesConversion'

const EURO_SYMBOL = '€'

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

export const formatToFrenchDecimalWithoutSpace = (cents: number) => {
  const euros = cents / CENTS_IN_EURO
  // we show 2 decimals if price is not round. Ex: 21,50€
  const fixed = euros === Math.floor(euros) ? euros : euros.toFixed(2)
  return `${fixed.toString().replace('.', ',')}${EURO_SYMBOL}`
}

export const getDateStatusAndPrice = (
  date: Date,
  stocksDates: { [date: string]: OfferStockResponse[] }
): { status: OfferStatus; price: string | null } => {
  const stocksByDate = stocksDates[formatToSlashedFrenchDate(date.toString())]
  if (!stocksByDate) return { status: OfferStatus.NOT_OFFERED, price: null }

  const prices = stocksByDate.map((stock) => stock.price)
  const price = formatToFrenchDecimalWithoutSpace(Math.min(...prices))
  const offerIsBookable = stocksByDate.some((stock) => stock.isBookable)

  if (offerIsBookable) return { status: OfferStatus.BOOKABLE, price }
  return { status: OfferStatus.NOT_BOOKABLE, price }
}
