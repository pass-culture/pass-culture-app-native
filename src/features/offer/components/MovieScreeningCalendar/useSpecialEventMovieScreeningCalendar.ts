import { useMemo, useState } from 'react'

import { StockResponse } from 'api/gen'

export const getDateString = (date: string) => new Date(date).toDateString()

export const useSpecialEventMovieScreeningCalendar = (stocks: StockResponse[], date?: Date) => {
  const [manuallySelectedDate, setManuallySelectedDate] = useState<Date>()

  const movieScreenings = useMemo(() => getSpecialEventMovieScreenings(stocks), [stocks])

  const movieScreeningDates: Date[] = useMemo(
    () =>
      Object.keys(movieScreenings)
        .map((dateString) => new Date(dateString))
        .sort((a, b) => {
          return a.getTime() - b.getTime()
        }),
    [movieScreenings]
  )
  const selectedDate = date ?? manuallySelectedDate ?? movieScreeningDates[0]

  const selectedScreeningStock = useMemo(() => {
    if (selectedDate) {
      const dateString = getDateString(String(selectedDate))
      return movieScreenings[dateString]
    }
    return undefined
  }, [movieScreenings, selectedDate])

  return {
    movieScreenings,
    movieScreeningDates,
    selectedDate,
    setSelectedDate: setManuallySelectedDate,
    selectedScreeningStock,
  }
}

export const getSpecialEventMovieScreenings = (stocks: StockResponse[]) =>
  stocks.reduce<Record<string, StockResponse[]>>((movieScreening, movieStock) => {
    const { beginningDatetime, isExpired, isForbiddenToUnderage } = movieStock
    if (
      beginningDatetime !== null &&
      beginningDatetime !== undefined &&
      !isExpired &&
      !isForbiddenToUnderage
    ) {
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
