import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  isSaturday,
  isSunday,
  nextSaturday,
  nextSunday,
  startOfDay,
  startOfMonth,
} from 'date-fns'

import { CalendarFilterId, CalendarModalFormData } from 'features/search/types'

const defaultValues: CalendarModalFormData = {
  selectedStartDate: undefined,
  selectedEndDate: undefined,
  selectedFilterMode: undefined,
}

export function getCalendarFormData(
  id: CalendarFilterId,
  today: Date,
  nextMonth: Date
): CalendarModalFormData {
  switch (id) {
    case 'today':
      return {
        selectedStartDate: today,
        selectedEndDate: undefined,
      }
    case 'thisWeek':
      return {
        selectedStartDate: today,
        selectedEndDate: endOfWeek(today, { weekStartsOn: 1 }),
      }
    case 'thisWeekend': {
      const saturday = isSaturday(today) || isSunday(today) ? today : nextSaturday(today)
      const sunday = isSunday(today) ? today : nextSunday(today)
      return {
        selectedStartDate: startOfDay(saturday),
        selectedEndDate: endOfDay(sunday),
      }
    }
    case 'thisMonth':
      return {
        selectedStartDate: today,
        selectedEndDate: endOfMonth(today),
      }
    case 'nextMonth':
      return {
        selectedStartDate: startOfMonth(nextMonth),
        selectedEndDate: endOfMonth(nextMonth),
      }
    default:
      return defaultValues
  }
}
