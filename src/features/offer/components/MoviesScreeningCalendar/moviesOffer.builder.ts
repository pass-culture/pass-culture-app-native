import { addDays, differenceInMilliseconds, isAfter, isSameDay } from 'date-fns'

import { OfferResponseV2 } from 'api/gen'
import { MoviesOffer } from 'features/offer/components/MoviesScreeningCalendar/getNextMoviesByDate'

export const moviesOfferBuilder = (offersWithStocks: OfferResponseV2[] = []) => {
  let moviesOffers: MoviesOffer[] = offersWithStocks.map((offer) => ({
    offer,
    isUpcoming: false,
  }))

  const builderObject = {
    withoutMoviesOnDay: (selectedDate: Date) => {
      moviesOffers = moviesOffers.filter(
        ({ offer }) =>
          !offer.stocks.some((stock) => {
            if (!stock.beginningDatetime) {
              return true
            }
            if (isSameDay(new Date(stock.beginningDatetime), selectedDate)) {
              return true
            }
            return false
          })
      )
      return builderObject
    },

    withMoviesOnDay: (selectedDate: Date) => {
      moviesOffers = moviesOffers
        .map(({ offer, ...rest }) => ({
          ...rest,
          offer: {
            ...offer,
            stocks: offer.stocks.filter(
              (stock) =>
                stock.beginningDatetime &&
                isSameDay(new Date(stock.beginningDatetime), selectedDate)
            ),
          },
        }))
        .filter(({ offer }) => offer.stocks.length > 0)

      return builderObject
    },

    sortedByLast30DaysBooking: () => {
      moviesOffers = moviesOffers.sort((a, b) => {
        const aValue = a.offer.last30DaysBookings
        const bValue = b.offer.last30DaysBookings

        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1

        return bValue - aValue
      })

      return builderObject
    },

    withoutMoviesAfter15Days: () => {
      moviesOffers = moviesOffers.filter(({ offer }) =>
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
      moviesOffers = moviesOffers.map(({ offer }) => {
        const nextDate = getNextDate(offer, selectedDate) ?? getUpcomingDate(offer)
        const upcomingDate = getUpcomingDate(offer)

        return {
          isUpcoming: nextDate === undefined || isSameDay(nextDate, upcomingDate as Date),
          offer,
          nextDate: nextDate ?? upcomingDate,
        }
      })

      return builderObject
    },

    build: () => {
      return moviesOffers
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
    const closestDifference = Math.abs(differenceInMilliseconds(referenceDate, closestDate))
    const currentDifference = Math.abs(differenceInMilliseconds(referenceDate, currentDate))

    return currentDifference < closestDifference ? currentDate : closestDate
  })
}

const getUpcomingDate = (offer: OfferResponseV2) => {
  return getNextDate(offer, new Date())
}
