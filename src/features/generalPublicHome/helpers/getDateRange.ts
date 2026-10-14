import { addMonths, endOfDay, max, parse, startOfDay } from 'date-fns'

import { DateFilter, DateRange } from 'features/generalPublicHome/types'
import { getCalendarFormData } from 'features/search/helpers/getCalendarFormData/getCalendarFormData'

export const getDateRange = (filter: DateFilter, now: Date): DateRange => {
  if (!filter) return {}

  if (filter.type === 'day') {
    const day = parse(filter.date, 'yyyy-MM-dd', now)
    return {
      beginningDatetime: max([startOfDay(day), now]).toISOString(),
      endingDatetime: endOfDay(day).toISOString(),
    }
  }

  const { selectedStartDate = now, selectedEndDate = endOfDay(now) } = getCalendarFormData(
    filter.preset,
    now,
    addMonths(now, 1)
  )
  return {
    beginningDatetime: selectedStartDate.toISOString(),
    endingDatetime: selectedEndDate.toISOString(),
  }
}
