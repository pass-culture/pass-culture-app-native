import { OfferStockResponse } from 'api/gen'

export const sortScreeningDates = (screeningDates: OfferStockResponse[]) =>
  screeningDates.sort((a, b) => {
    return a.beginningDatetime && b.beginningDatetime
      ? new Date(a.beginningDatetime).getTime() - new Date(b.beginningDatetime).getTime()
      : 0
  })
