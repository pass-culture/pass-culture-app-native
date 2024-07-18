import { addDays, differenceInMilliseconds, isAfter, isSameDay } from 'date-fns'

import { OfferResponseV2, OfferStockResponse } from 'api/gen'
import { MovieOffer } from 'features/offer/components/MoviesScreeningCalendar/getNextMoviesByDate'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'

export const moviesOfferBuilder = (offersWithStocks: OfferResponseV2[] = []) => {
  let movieOffers: MovieOffer[] = offersWithStocks.map((offer) => ({
    offer,
    isUpcoming: false,
  }))

  const builderObject = {
    withoutMoviesOnDay: (selectedDate: Date) => {
      movieOffers = movieOffers.filter(
        ({ offer }) =>
          !offer.stocks.some((stock) => {
            if (!stock.beginningDatetime) {
              return true
            }
            if (isSameDay(new Date(stock.beginningDatetime), selectedDate)) {
              return isAfter(new Date(stock.beginningDatetime), selectedDate)
            }
            return false
          })
      )
      return builderObject
    },

    withMoviesOnDay: (selectedDate: Date) => {
      movieOffers = movieOffers
        .map(({ offer, ...rest }) => ({
          ...rest,
          offer: {
            ...offer,
            stocks: offer.stocks.filter((stock) => {
              if (!stock.beginningDatetime) {
                return useIsFalseWithDelay
              }
              const now = new Date()
              const isSameDate = isSameDay(new Date(stock.beginningDatetime), selectedDate)
              const isAfterNow = isAfter(new Date(stock.beginningDatetime), now)

              if (isSameDay(now, selectedDate)) {
                return isSameDate && isAfterNow
              }

              return isSameDate
            }),
          },
        }))
        .filter(({ offer }) => offer.stocks.length > 0)

      return builderObject
    },

    sortedByLast30DaysBooking: () => {
      movieOffers = movieOffers.sort((a, b) => {
        const aValue = a.offer.last30DaysBookings
        const bValue = b.offer.last30DaysBookings

        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1

        if (bValue === aValue) {
          const aEarliestDate = getEarliestDate(a.offer.stocks)
          const bEarliestDate = getEarliestDate(b.offer.stocks)

          return aEarliestDate - bEarliestDate
        }

        return bValue - aValue
      })

      return builderObject
    },

    withoutMoviesAfter15Days: () => {
      movieOffers = movieOffers.filter(({ offer }) =>
        offer.stocks.some((stock) => {
          if (!stock.beginningDatetime) {
            return false
          }
          if (isDateNotWithinNext15Days(new Date(), new Date(stock.beginningDatetime))) {
            return false
          }
          return true
        })
      )
      return builderObject
    },

    withNextScreeningFromDate: (selectedDate: Date) => {
      movieOffers = movieOffers
        .map(({ offer }) => {
          const nextDate = getNextDate(offer, selectedDate) ?? getUpcomingDate(offer)
          const upcomingDate = getUpcomingDate(offer)

          return {
            isUpcoming: nextDate === undefined || isSameDay(nextDate, upcomingDate as Date),
            offer,
            nextDate: nextDate ?? upcomingDate,
          }
        })
        .filter(({ nextDate }) => !!nextDate)

      return builderObject
    },

    build: () => {
      return movieOffers
    },
  }

  return builderObject
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
    if (!closestDate) {
      return currentDate
    }

    const closestDifference = Math.abs(differenceInMilliseconds(referenceDate, closestDate))
    const currentDifference = Math.abs(differenceInMilliseconds(referenceDate, currentDate))

    return currentDifference < closestDifference ? currentDate : closestDate
  }, futureDates[0])
}

const getUpcomingDate = (offer: OfferResponseV2) => {
  return getNextDate(offer, new Date())
}

const getEarliestDate = (stocks: OfferStockResponse[]) => {
  return stocks.reduce((earliest, stock) => {
    if (!stock.beginningDatetime) return earliest
    const stockDate = new Date(stock.beginningDatetime).getTime()
    return stockDate < earliest ? stockDate : earliest
  }, Infinity)
}
