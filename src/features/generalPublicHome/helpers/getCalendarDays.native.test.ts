import { getCalendarDays } from 'features/generalPublicHome/helpers/getCalendarDays'

// Wednesday
const NOW = new Date('2026-10-14T10:30:00.000Z')

describe('getCalendarDays', () => {
  it('should return as many days as requested', () => {
    expect(getCalendarDays(NOW, 14)).toHaveLength(14)
  })

  it('should start from today', () => {
    expect(getCalendarDays(NOW, 2)).toEqual(['2026-10-14', '2026-10-15'])
  })

  it('should continue over the next month', () => {
    expect(getCalendarDays(NOW, 20).at(-1)).toBe('2026-11-02')
  })

  it('should return no day for a zero count', () => {
    expect(getCalendarDays(NOW, 0)).toEqual([])
  })
})
