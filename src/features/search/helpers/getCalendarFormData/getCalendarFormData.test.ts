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

import { getCalendarFormData } from 'features/search/helpers/getCalendarFormData/getCalendarFormData'

const today = new Date('2025-06-03T10:00:00Z')
const nextMonth = new Date('2025-07-01T00:00:00Z')

const defaultValues = {
  selectedStartDate: undefined,
  selectedEndDate: undefined,
  isToday: false,
  isThisWeek: false,
  isThisWeekend: false,
  isThisMonth: false,
  isNextMonth: false,
}

describe('getCalendarFormData', () => {
  it('should return values for "today"', () => {
    const result = getCalendarFormData('today', today, nextMonth)

    expect(result).toEqual({
      ...defaultValues,
      selectedStartDate: today,
      isToday: true,
    })
  })

  it('should return values for "thisWeek"', () => {
    const result = getCalendarFormData('thisWeek', today, nextMonth)

    expect(result).toEqual({
      ...defaultValues,
      selectedStartDate: today,
      selectedEndDate: endOfWeek(today, { weekStartsOn: 1 }),
      isThisWeek: true,
    })
  })

  describe('should return values for "thisWeekend"', () => {
    it('when today is a weekday', () => {
      const result = getCalendarFormData('thisWeekend', today, nextMonth)
      const expectedStart = startOfDay(nextSaturday(today))
      const expectedEnd = endOfDay(nextSunday(today))

      expect(result).toEqual({
        ...defaultValues,
        selectedStartDate: expectedStart,
        selectedEndDate: expectedEnd,
        isThisWeekend: true,
      })
    })

    it('when today is Saturday', () => {
      const saturday = new Date('2025-06-07T10:00:00Z')

      expect(isSaturday(saturday)).toBe(true)

      const result = getCalendarFormData('thisWeekend', saturday, nextMonth)
      const expectedStart = startOfDay(saturday)
      const expectedEnd = endOfDay(nextSunday(saturday))

      expect(result).toEqual({
        ...defaultValues,
        selectedStartDate: expectedStart,
        selectedEndDate: expectedEnd,
        isThisWeekend: true,
      })
    })

    it('when today is Sunday', () => {
      const sunday = new Date('2025-06-08T10:00:00Z')

      expect(isSunday(sunday)).toBe(true)

      const result = getCalendarFormData('thisWeekend', sunday, nextMonth)
      const expectedStart = startOfDay(sunday)
      const expectedEnd = endOfDay(sunday)

      expect(result).toEqual({
        ...defaultValues,
        selectedStartDate: expectedStart,
        selectedEndDate: expectedEnd,
        isThisWeekend: true,
      })
    })
  })

  it('should return values for "thisMonth"', () => {
    const result = getCalendarFormData('thisMonth', today, nextMonth)

    expect(result).toEqual({
      ...defaultValues,
      selectedStartDate: today,
      selectedEndDate: endOfMonth(today),
      isThisMonth: true,
    })
  })

  it('should return values for "nextMonth"', () => {
    const result = getCalendarFormData('nextMonth', today, nextMonth)

    expect(result).toEqual({
      ...defaultValues,
      selectedStartDate: startOfMonth(nextMonth),
      selectedEndDate: endOfMonth(nextMonth),
      isNextMonth: true,
    })
  })
})
