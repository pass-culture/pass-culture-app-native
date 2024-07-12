import { addDays, differenceInMilliseconds, isAfter, isSameDay } from 'date-fns'

import { OfferResponseV2 } from 'api/gen'

export type NextMovie = {
  nextDate: Date | undefined
  isUpcomming: boolean
  movie: OfferResponseV2
}

export const getNextMoviesByDate = (
  offersWithStocks: OfferResponseV2[],
  date: Date
): NextMovie[] => {
  const filteredOffers: NextMovie[] = offersWithStocks
    .filter((offer) =>
      offer.stocks.some((stock) => {
        if (!stock.beginningDatetime) {
          return false
        }
        if (isSameDay(new Date(stock.beginningDatetime), date)) {
          return false
        }
        if (isDateNotWithinNext15Days(new Date(), new Date(stock.beginningDatetime))) {
          return false
        }
        return true
      })
    )
    .map((offer) => {
      const nextDate = getNextDate(offer, date) ?? getUpcomingDate(offer)
      const upcomingDate = getUpcomingDate(offer)

      return {
        isUpcomming: nextDate === undefined || isSameDay(nextDate, upcomingDate as Date),
        movie: offer,
        nextDate: nextDate ?? upcomingDate,
      }
    })

  return filteredOffers
}

const isDateNotWithinNext15Days = (referenceDate: Date, targetDate: Date) => {
  const datePlus15Days = addDays(referenceDate, 15)

  return isAfter(targetDate, datePlus15Days)
}

const getNextDate = (offer: OfferResponseV2, date: Date) => {
  const dates = offer.stocks
    .filter((stock) => stock.beginningDatetime)
    .map((stock) => new Date(stock.beginningDatetime as string))

  return findClosestFutureDate(dates, date)
}

const findClosestFutureDate = (datesArray: Date[], referenceDate: Date) => {
  const futureDates = datesArray.filter((date) => isAfter(date, referenceDate))

  if (futureDates.length === 0) {
    return undefined
  }

  return futureDates.reduce((closestDate, currentDate) => {
    const closestDifference = Math.abs(differenceInMilliseconds(referenceDate, closestDate))
    const currentDifference = Math.abs(differenceInMilliseconds(referenceDate, currentDate))

    return currentDifference < closestDifference ? currentDate : closestDate
  })
}

const getUpcomingDate = (offer: OfferResponseV2) => {
  return getNextDate(offer, new Date())
}
