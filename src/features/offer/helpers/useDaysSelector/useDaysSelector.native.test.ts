import { isSameDay, startOfDay } from 'date-fns'

import { getDates } from 'shared/date/getDates'
import { renderHook, act } from 'tests/utils'

import { useDaysSelector } from './useDaysSelector'

jest.mock('shared/date/getDates')

describe('useDaysSelector', () => {
  const mockDates = [new Date('2023-01-01'), new Date('2023-01-02'), new Date('2023-01-03')]

  beforeEach(() => {
    jest.mocked(getDates).mockReturnValue(mockDates as unknown as [])
  })

  it('should initialize with the first date', () => {
    const { result } = renderHook(() => useDaysSelector(mockDates))

    expect(result.current.selectedDate).toEqual(mockDates[0])
    expect(result.current.dates).toEqual(mockDates)
  })

  it('should update selectedDate when setSelectedDate is called with a new date', () => {
    const { result } = renderHook(() => useDaysSelector(mockDates))

    act(() => {
      result.current.setSelectedDate(new Date('2023-01-02'))
    })

    expect(isSameDay(result.current.selectedDate, new Date('2023-01-02'))).toBe(true)
  })

  it('should not update selectedDate when setSelectedDate is called with the same date', () => {
    const { result } = renderHook(() => useDaysSelector(mockDates))

    const initialSelectedDate = result.current.selectedDate

    act(() => {
      result.current.setSelectedDate(initialSelectedDate)
    })

    expect(result.current.selectedDate).toBe(initialSelectedDate)
  })

  it('should set selectedDate to start of day', () => {
    const { result } = renderHook(() => useDaysSelector(mockDates))

    const dateWithTime = new Date('2023-01-02T12:34:56')
    act(() => {
      result.current.setSelectedDate(dateWithTime)
    })

    expect(result.current.selectedDate).toEqual(startOfDay(dateWithTime))
  })
})
