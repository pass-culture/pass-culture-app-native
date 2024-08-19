import { useEffect, useMemo, useState } from 'react'

import { OfferStockResponse } from 'api/gen'

export const getDateString = (date: string) => new Date(date).toDateString()

export const useMovieScreeningCalendar = (stocks: OfferStockResponse[], date?: Date) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date)

  const movieScreenings = useMemo(() => getMovieScreenings(stocks), [stocks])

  const movieScreeningDates: Date[] = useMemo(
    () =>
      Object.keys(movieScreenings)
        .map((dateString) => new Date(dateString))
        .sort((a, b) => {
          return a.getTime() - b.getTime()
        }),
    [movieScreenings]
  )

  const selectedScreeningStock = useMemo(() => {
    if (selectedDate) {
      const dateString = getDateString(String(selectedDate))
      return movieScreenings[dateString]
    }
    return undefined
  }, [movieScreenings, selectedDate])

  useEffect(() => {
    if (!selectedDate && movieScreeningDates.length > 0) setSelectedDate(movieScreeningDates[0])
  }, [movieScreeningDates, selectedDate])

  useEffect(() => {
    setSelectedDate(date)
  }, [date])

  return {
    movieScreenings,
    movieScreeningDates,
    selectedDate,
    setSelectedDate,
    selectedScreeningStock,
  }
}

export const getMovieScreenings = (stocks: OfferStockResponse[]) =>
  stocks.reduce<Record<string, OfferStockResponse[]>>((movieScreening, movieStock) => {
    const { beginningDatetime, isExpired, isForbiddenToUnderage } = movieStock
    if (beginningDatetime != null && !isExpired && !isForbiddenToUnderage) {
      const movieScreeningDay = getDateString(beginningDatetime)
      const movieStocks = movieScreening[movieScreeningDay]
      if (movieStocks) {
        movieStocks.push(movieStock)
      } else {
        movieScreening[movieScreeningDay] = [movieStock]
      }
    }

    return movieScreening
  }, {})
