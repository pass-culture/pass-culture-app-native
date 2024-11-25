import { isSameDay, startOfDay } from 'date-fns'
import { useCallback, useState } from 'react'

export const useDaysSelector = (dates: Date[]) => {
  const [internalDates, setInternalDates] = useState<Date[]>(dates)
  const [selectedInternalDate, setSelectedInternalDate] = useState<Date>(
    dates?.[0] || startOfDay(new Date())
  )

  const setSelectedDate = useCallback(
    (date: Date) => {
      if (!isSameDay(selectedInternalDate, date)) {
        setSelectedInternalDate(startOfDay(date))
      }
    },
    [selectedInternalDate]
  )

  return {
    selectedDate: selectedInternalDate,
    dates: internalDates,
    setSelectedDate,
    setDates: setInternalDates,
  }
}
