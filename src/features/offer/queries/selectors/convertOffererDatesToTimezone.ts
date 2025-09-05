import { OffersStocksResponseV2 } from 'api/gen'
import { getTimeZonedDate } from 'libs/parsers/formatDates'

export const convertOffererDatesToTimezone = (
  data: OffersStocksResponseV2
): OffersStocksResponseV2 => {
  return {
    ...data,
    offers: data.offers.map((offer) => {
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
      }
    }),
  }
}
