import { isToday } from 'date-fns'

import { OfferForStocksResponse, OfferResponse } from 'api/gen'
import { moviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'
import { specialEventMoviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/specialEventMoviesOffer.builder'

const filterDaysWithNoScreenings = (dates: Date[], hasScreenings: (date: Date) => boolean) =>
  dates.filter((date) => !isToday(date) && !hasScreenings(date))

export const getDaysWithNoScreenings = (offers: OfferResponse[], dates: Date[]) =>
  filterDaysWithNoScreenings(
    dates,
    (date) => moviesOfferBuilder(offers).withScreeningsOnDay(date).build().length > 0
  )

export const getSpecialEventDaysWithNoScreenings = (
  offers: OfferForStocksResponse[],
  dates: Date[]
) =>
  filterDaysWithNoScreenings(
    dates,
    (date) => specialEventMoviesOfferBuilder(offers).withScreeningsOnDay(date).build().length > 0
  )
