import { getCalendarFilterId } from 'features/search/helpers/getCalendarFilterId/getCalendarFilterId'
import { CalendarModalFormData } from 'features/search/types'

const defaultValues: CalendarModalFormData = {
  isToday: false,
  isThisWeek: false,
  isThisWeekend: false,
  isThisMonth: false,
  isNextMonth: false,
}

describe('getCalendarFilterId', () => {
  it('should return "today" if isToday is true', () => {
    expect(getCalendarFilterId({ ...defaultValues, isToday: true })).toEqual('today')
  })

  it('should return "thisWeek" if isThisWeek is true', () => {
    expect(getCalendarFilterId({ ...defaultValues, isThisWeek: true })).toEqual('thisWeek')
  })

  it('should return "thisWeekend" if isThisWeekend is true', () => {
    expect(getCalendarFilterId({ ...defaultValues, isThisWeekend: true })).toEqual('thisWeekend')
  })

  it('should return "thisMonth" if isThisMonth is true', () => {
    expect(getCalendarFilterId({ ...defaultValues, isThisMonth: true })).toEqual('thisMonth')
  })

  it('should return "nextMonth" if isNextMonth is true', () => {
    expect(getCalendarFilterId({ ...defaultValues, isNextMonth: true })).toEqual('nextMonth')
  })

  it('should return undefined if all values are false', () => {
    expect(getCalendarFilterId(defaultValues)).toBeUndefined()
  })
})
