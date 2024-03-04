import { useEffect, useState, useMemo } from 'react'

import { OfferStockResponse } from 'api/gen'

export const useMovieScreeningCalendar = (stocks: OfferStockResponse[]) => {
  const [selectedDate, setSelectedDate] = useState<Date>()

  const getDateString = (date: string) => new Date(date).toDateString()

  const movieScreenings = useMemo(
    () =>
      stocks.reduce<{
        [key: string]: OfferStockResponse[]
      }>((movieScreening, movieStock) => {
        const { beginningDatetime, isExpired, isForbiddenToUnderage } = movieStock
        if (beginningDatetime != null && !isExpired && !isForbiddenToUnderage) {
          const movieScreeningDay = getDateString(beginningDatetime)
          if (movieScreening[movieScreeningDay]) {
            movieScreening[movieScreeningDay].push(movieStock)
          } else {
            movieScreening[movieScreeningDay] = [movieStock]
          }
        }

        return movieScreening
      }, {}),
    [stocks]
  )

  const movieScreeningDates: Date[] = useMemo(
    () =>
      Object.keys(movieScreenings)
        .map((dateString) => new Date(dateString))
        .sort(),
    [movieScreenings]
  )

  useEffect(() => {
    setSelectedDate(movieScreeningDates[0])
  }, [movieScreeningDates])

  return { movieScreenings, movieScreeningDates, selectedDate, setSelectedDate }
}
