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
  isToday: false,
  isThisWeek: false,
  isThisWeekend: false,
  isThisMonth: false,
  isNextMonth: false,
}

export function getCalendarFormData(
  id: CalendarFilterId,
  today: Date,
  nextMonth: Date
): CalendarModalFormData {
  switch (id) {
    case 'today':
      return {
        ...defaultValues,
        selectedStartDate: today,
        isToday: true,
      }
    case 'thisWeek':
      return {
        ...defaultValues,
        selectedStartDate: today,
        selectedEndDate: endOfWeek(today, { weekStartsOn: 1 }),
        isThisWeek: true,
      }
    case 'thisWeekend': {
      const saturday = isSaturday(today) || isSunday(today) ? today : nextSaturday(today)
      const sunday = isSunday(today) ? today : nextSunday(today)
      return {
        ...defaultValues,
        selectedStartDate: startOfDay(saturday),
        selectedEndDate: endOfDay(sunday),
        isThisWeekend: true,
      }
    }
    case 'thisMonth':
      return {
        ...defaultValues,
        selectedStartDate: today,
        selectedEndDate: endOfMonth(today),
        isThisMonth: true,
      }
    case 'nextMonth':
      return {
        ...defaultValues,
        selectedStartDate: startOfMonth(nextMonth),
        selectedEndDate: endOfMonth(nextMonth),
        isNextMonth: true,
      }
    default:
      return defaultValues
  }
}
