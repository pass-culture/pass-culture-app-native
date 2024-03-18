import { useEffect, useState, useMemo } from 'react'

import { OfferStockResponse } from 'api/gen'

const getDateString = (date: string) => new Date(date).toDateString()

export const useMovieScreeningCalendar = (stocks: OfferStockResponse[]) => {
  const [selectedDate, setSelectedDate] = useState<Date>()

  const movieScreenings = useMemo(
    () =>
      stocks.reduce<{
        [key: string]: OfferStockResponse[]
      }>((movieScreening, movieStock) => {
        const { beginningDatetime, isExpired, isForbiddenToUnderage } = movieStock
        if (beginningDatetime != null && !isExpired && !isForbiddenToUnderage) {
          const movieScreeningDay = getDateString(beginningDatetime)
          if (movieScreening[movieScreeningDay]) {
            // @ts-expect-error: because of noUncheckedIndexedAccess
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
        .sort((a, b) => {
          return a.getTime() - b.getTime()
        }),
    [movieScreenings]
  )

  const selectedScreeningStock = useMemo(
    () => movieScreenings[getDateString(`${selectedDate}`)],
    [movieScreenings, selectedDate]
  )

  useEffect(() => {
    setSelectedDate(movieScreeningDates[0])
  }, [movieScreeningDates])

  return {
    movieScreenings,
    movieScreeningDates,
    selectedDate,
    setSelectedDate,
    selectedScreeningStock,
  }
}
