import { getTimeZonedDate } from 'libs/parsers/formatDates'

type OfferWithDatedStocks = {
  address?: { timezone: string } | null
  venue: { timezone: string }
  stocks: Array<{
    beginningDatetime?: string | null
    bookingLimitDatetime?: string | null
    cancellationLimitDatetime?: string | null
  }>
}

export const convertOfferDatesToTimezone = <T extends OfferWithDatedStocks>(offer: T): T => {
  const timezone = offer.address?.timezone ?? offer.venue.timezone

  return {
    ...offer,
    stocks: offer.stocks.map((stock) => ({
      ...stock,
      beginningDatetime: stock.beginningDatetime
        ? getTimeZonedDate({
            date: new Date(stock.beginningDatetime),
            timezone,
          }).toISOString()
        : null,
      bookingLimitDatetime: stock.bookingLimitDatetime
        ? getTimeZonedDate({
            date: new Date(stock.bookingLimitDatetime),
            timezone,
          }).toISOString()
        : null,
      cancellationLimitDatetime: stock.cancellationLimitDatetime
        ? getTimeZonedDate({
            date: new Date(stock.cancellationLimitDatetime),
            timezone,
          }).toISOString()
        : null,
    })),
  } as T
}
