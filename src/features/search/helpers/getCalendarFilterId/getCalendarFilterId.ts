import { CalendarModalFormData } from 'features/search/types'

export function getCalendarFilterId(formData: CalendarModalFormData) {
  if (formData.isToday) return 'today'
  if (formData.isThisWeek) return 'thisWeek'
  if (formData.isThisWeekend) return 'thisWeekend'
  if (formData.isThisMonth) return 'thisMonth'
  if (formData.isNextMonth) return 'nextMonth'

  return undefined
}
