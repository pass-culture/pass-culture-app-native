import { useMemo, useState } from 'react'

import { StockResponse } from 'api/gen'
import {
  getDateString,
  getMovieScreenings,
} from 'features/offer/helpers/getMovieScreenings/getMovieScreenings'

export const useSpecialEventMovieScreeningCalendar = (stocks: StockResponse[], date?: Date) => {
  const [manuallySelectedDate, setManuallySelectedDate] = useState<Date>()

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
