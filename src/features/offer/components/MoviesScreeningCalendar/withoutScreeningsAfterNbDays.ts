import {
  isSameDay,
  isAfter,
  addDays,
  startOfDay,
  isBefore,
  differenceInMilliseconds,
} from 'date-fns'

import type { OfferResponseV2, OfferStockResponse } from 'api/gen'
import type { MovieOffer } from 'features/offer/components/MoviesScreeningCalendar/getNextMoviesByDate'
import type { GeoCoordinates } from 'libs/location'
import { computeDistanceInMeters } from 'libs/parsers/formatDistance'

export const withoutScreeningsAfterNbDays =
  (nbDays: number) =>
  ({ offer }: MovieOffer) =>
    offer.stocks.some((stock) => {
      if (!stock.beginningDatetime) {
        return false
      }
      if (isDateNotWithinNextNbDays(new Date(), new Date(stock.beginningDatetime), nbDays)) {
        return false
      }
      if (isDateBeforeToday(new Date(), new Date(stock.beginningDatetime))) {
        return false
      }
      return true
    })

type Predicate = (toto: MovieOffer) => boolean

const mergeFilter = (filter1: Predicate, filter2: Predicate) => {
  return (toto: MovieOffer) => filter1(toto) && filter2(toto)
}

const predicatInverse = (filter: Predicate) => {
  const lePrédicatInversé: Predicate = (movieOffer) => !filter(movieOffer)
  return lePrédicatInversé
}

export const withoutScreeningsOnDay =
  (selectedDate: Date) =>
  ({ offer }: MovieOffer) =>
    !offer.stocks.some((stock) => {
      if (!stock.beginningDatetime) {
        return true
      }
      if (isSameDay(new Date(stock.beginningDatetime), selectedDate)) {
        return isAfter(new Date(stock.beginningDatetime), selectedDate)
      }
      return false
    })

export const withNextScreeningFromDate = (selectedDate: Date) => {
  return ({ offer }: MovieOffer) => {
    const nextDate = getNextDate(offer, selectedDate) ?? getUpcomingDate(offer)
    return !!nextDate
  }
}

export const withoutNextScreeningFromDate = (selectedDate: Date) => {
  const précidat = withNextScreeningFromDate(selectedDate)
  return predicatInverse(précidat)
}

export const sortedByLast30DaysBooking = (a: MovieOffer, b: MovieOffer) => {
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
}
const moviesOfferBuilder = (offersWithStocks: OfferResponseV2[] = []) => {
  let movieOffers: MovieOffer[] = offersWithStocks.map((offer) => ({
    offer,
    isUpcoming: false,
  }))

  const builderObject = {
    withScreeningsOnDay: (selectedDate: Date) => {
      movieOffers = movieOffers
        .map(({ offer, ...rest }) => ({
          ...rest,
          offer: {
            ...offer,
            stocks: offer.stocks.filter((stock) => {
              if (!stock.beginningDatetime) {
                return false
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

    sortedByDistance: (location: GeoCoordinates) => {
      movieOffers = movieOffers.sort(sortOffersByDistanceThenDate(location))

      return builderObject
    },

    withScreeningsAfterNbDays: (nbDays: number) => {
      movieOffers = movieOffers
        .map(({ offer }) => {
          const filteredStocks = offer.stocks.filter((stock) => {
            if (!stock.beginningDatetime) {
              return false
            }

            return isDateNotWithinNextNbDays(new Date(), new Date(stock.beginningDatetime), nbDays)
          })
          return {
            nextDate: new Date(filteredStocks[0]?.beginningDatetime as string),
            offer: {
              ...offer,
              stocks: filteredStocks,
            },
          }
        })
        .filter(({ offer }) => offer.stocks.length > 0)

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

    buildOfferResponse: () => {
      return movieOffers.reduce<OfferResponseV2[]>(
        (previous, current) => [...previous, current.offer],
        []
      )
    },

    build: (): MovieOffer[] => {
      return movieOffers
    },
  }

  return builderObject
}
function sortOffersByDistanceThenDate(
  location: GeoCoordinates
): ((a: MovieOffer, b: MovieOffer) => number) | undefined {
  return (a, b) => {
    const aDistance = toto(a, location)
    const bDistance = toto(b, location)

    if (aDistance === bDistance) {
      const aEarliestDate = getEarliestDate(a.offer.stocks)
      const bEarliestDate = getEarliestDate(b.offer.stocks)
      return aEarliestDate - bEarliestDate
    }

    return aDistance - bDistance
  }
}
function toto(b: MovieOffer, location: GeoCoordinates) {
  return computeDistanceInMeters(
    b.offer.venue.coordinates.latitude ?? 0,
    b.offer.venue.coordinates.longitude ?? 0,
    location?.latitude,
    location?.longitude
  )
}

export const isDateNotWithinNextNbDays = (
  referenceDate: Date,
  targetDate: Date,
  nbDays: number
) => {
  const datePlusNbDays = addDays(startOfDay(referenceDate), nbDays)

  return isAfter(targetDate, datePlusNbDays)
}
const isDateBeforeToday = (referenceDate: Date, targetDate: Date) => {
  return isBefore(targetDate, referenceDate)
}
const getNextDate = (offer: OfferResponseV2, date: Date) => {
  const dates = offer.stocks
    .filter((stock) => stock.beginningDatetime)
    .map((stock) => new Date(stock.beginningDatetime as string))

  const nextDate = findClosestFutureDate(dates, date)

  if (nextDate && isDateNotWithinNextNbDays(new Date(), nextDate, 15)) {
    return undefined
  }
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
