import { useEffect, useMemo, useState } from 'react'

import { OfferStockResponse } from 'api/gen'
import {
  getDateString,
  getMovieScreenings,
} from 'features/offer/helpers/getMovieScreenings/getMovieScreenings'

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
