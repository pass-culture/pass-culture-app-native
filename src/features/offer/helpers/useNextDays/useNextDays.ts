import { isSameDay, startOfDay } from 'date-fns'
import { useCallback, useState } from 'react'

import { getDates } from 'shared/date/getDates'

export const useNextDays = <T extends Readonly<number>>(nbOfDays: T) => {
  const dates = getDates(new Date(), nbOfDays)
  const [selectedInternalDate, setSelectedInternalDate] = useState<Date>(
    (dates as Date[])[0] as Date
  )

  const setSelectedDate = useCallback(
    (date: Date) => {
      if (!isSameDay(selectedInternalDate, date)) {
        setSelectedInternalDate(startOfDay(date))
      }
    },
    [selectedInternalDate]
  )

  return { selectedDate: selectedInternalDate, setSelectedDate, dates }
}
