import { OfferForStocksResponse } from 'api/gen'

export const getHasSpecialEventScreenings = (
  offers: OfferForStocksResponse[],
  dates: Date[]
): boolean =>
  offers.some((offer) =>
    offer.stocks.some((stock) => {
      if (!stock.beginningDatetime) {
        return false
      }
      const stockDate = new Date(stock.beginningDatetime)
      const isStockInDates = dates.some(
        (date) =>
          date.getFullYear() === stockDate.getFullYear() &&
          date.getMonth() === stockDate.getMonth() &&
          date.getDate() === stockDate.getDate()
      )
      return isStockInDates && !!stock.screeningFeatures?.specialEventType
    })
  )
