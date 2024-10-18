import { useMemo } from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import { useOffersStocks } from 'features/offer/api/useOffersStocks'
import { filterOffersStocksByDate } from 'features/offer/components/MoviesScreeningCalendar/filterOffersStocksByDate'
import {
  MovieOffer,
  getNextMoviesByDate,
} from 'features/offer/components/MoviesScreeningCalendar/getNextMoviesByDate'
import { useMovieCalendar } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'

export const useMoviesScreeningsList = (offerIds: number[]) => {
  const { selectedDate } = useMovieCalendar()
  const { data: offersWithStocks } = useOffersStocks({ offerIds })

  const moviesOffers: MovieOffer[] = useMemo(() => {
    const filteredOffersWithStocks = filterOffersStocksByDate(
      offersWithStocks?.offers || [],
      selectedDate
    )

    const nextScreeningOffers = getNextMoviesByDate(offersWithStocks?.offers || [], selectedDate)

    return [...filteredOffersWithStocks, ...nextScreeningOffers]
  }, [offersWithStocks?.offers, selectedDate]).filter(
    (offer) => offer.offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  )

  return {
    moviesOffers,
  }
}
