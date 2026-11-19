import { isSameDay } from 'date-fns'

import { OfferForStocksResponse } from 'api/gen'
import {
  compareSpecialEventMovieOffersByBookings,
  compareSpecialEventMovieOffersByDate,
  compareSpecialEventMovieOffersByDistance,
} from 'features/offer/components/MoviesScreeningCalendar/helpers/specialEventMovieOfferComparators'
import {
  getNextScreeningDate,
  getUpcomingScreeningDate,
} from 'features/offer/components/MoviesScreeningCalendar/helpers/specialEventMovieOfferDates'
import {
  getScreeningsAfterNbDays,
  getScreeningsOnDay,
  hasScreeningWithinNextNbDays,
  shouldKeepOfferWithoutScreeningsOnDay,
} from 'features/offer/components/MoviesScreeningCalendar/helpers/specialEventMovieOfferStocks'
import { SpecialEventMovieOffer } from 'features/offer/components/MoviesScreeningCalendar/specialEventTypes'
import { GeoCoordinates } from 'libs/location/location'

export const specialEventMoviesOfferBuilder = (offersWithStocks: OfferForStocksResponse[] = []) => {
  let movieOffers: SpecialEventMovieOffer[] = offersWithStocks.map((offer) => ({
    offer,
    isUpcoming: false,
  }))

  const builderObject = {
    withoutScreeningsOnDay: (selectedDate: Date) => {
      movieOffers = movieOffers.filter(({ offer }) =>
        shouldKeepOfferWithoutScreeningsOnDay(offer.stocks, selectedDate)
      )
      return builderObject
    },

    withScreeningsOnDay: (selectedDate: Date) => {
      movieOffers = movieOffers
        .map(({ offer, ...rest }) => ({
          ...rest,
          offer: {
            ...offer,
            stocks: getScreeningsOnDay(offer.stocks, selectedDate),
          },
        }))
        .filter(({ offer }) => offer.stocks.length > 0)

      return builderObject
    },

    sortedByLast30DaysBooking: () => {
      movieOffers = movieOffers.sort(compareSpecialEventMovieOffersByBookings)

      return builderObject
    },

    sortedByDistance: (location: GeoCoordinates) => {
      movieOffers = movieOffers.sort(compareSpecialEventMovieOffersByDistance(location))
      return builderObject
    },

    sortedByDate: () => {
      movieOffers = movieOffers.sort(compareSpecialEventMovieOffersByDate)

      return builderObject
    },

    withScreeningsAfterNbDays: (nbDays: number) => {
      movieOffers = movieOffers
        .map(({ offer }) => {
          const filteredStocks = getScreeningsAfterNbDays(offer.stocks, new Date(), nbDays)
          return {
            nextDate: new Date(filteredStocks[0]?.beginningDatetime as string),
            offer: {
              ...offer,
              stocks: filteredStocks,
            },
            isUpcoming: false,
          }
        })
        .filter(({ offer }) => offer.stocks.length > 0)
      return builderObject
    },

    withoutScreeningsAfterNbDays: (nbDays: number) => {
      movieOffers = movieOffers.filter(({ offer }) =>
        hasScreeningWithinNextNbDays(offer.stocks, new Date(), nbDays)
      )
      return builderObject
    },

    withNextScreeningFromDate: (selectedDate: Date) => {
      movieOffers = movieOffers
        .map(({ offer }) => {
          const upcomingDate = getUpcomingScreeningDate(offer.stocks)
          const nextDate = getNextScreeningDate(offer.stocks, selectedDate) ?? upcomingDate

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
      return movieOffers.reduce<OfferForStocksResponse[]>(
        (previous, current) => [...previous, current.offer],
        []
      )
    },

    build: () => {
      return movieOffers
    },
  }

  return builderObject
}
