import { startOfDay } from 'date-fns'
import mockdate from 'mockdate'

import { getInitialSelectedDate, updateSelectedDate } from 'features/offerRefacto/core'

mockdate.set(new Date(2025, 10, 5, 14, 0))

describe('getInitialSelectedDate', () => {
  it('should return first date of the array if exists', () => {
    const dates = [new Date(2025, 10, 5), new Date(2025, 10, 6)]
    const result = getInitialSelectedDate(dates)

    expect(result).toEqual(dates[0])
  })

  it('should return date of the day if array is empty', () => {
    const result = getInitialSelectedDate([])
    const expected = startOfDay(new Date(2025, 10, 5))

    expect(result).toEqual(expected)
  })
})

describe('updateSelectedDate', () => {
  it('should return startOfDay of new date if different', () => {
    const current = new Date(2025, 10, 5, 10, 0)
    const next = new Date(2025, 10, 6, 15, 0)

    const result = updateSelectedDate(current, next)

    expect(result).toEqual(startOfDay(next))
  })

  it('should return current date if dates are the same day', () => {
    const current = new Date(2025, 10, 5, 0, 0)
    const next = new Date(2025, 10, 5, 14, 0)

    const result = updateSelectedDate(current, next)

    expect(result).toEqual(current)
  })
})
