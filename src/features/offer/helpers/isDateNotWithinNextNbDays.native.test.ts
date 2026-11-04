import { isDateNotWithinNextNbDays } from './isDateNotWithinNextNbDays'

describe('isDateNotWithinNextNbDays', () => {
  const referenceDate = new Date('2026-11-02T12:00:00Z')

  it('returns false when the target date is within the period', () => {
    expect(isDateNotWithinNextNbDays(referenceDate, new Date('2026-11-17T00:00:00Z'), 15)).toBe(
      false
    )
  })

  it('returns true when the target date is after the period', () => {
    expect(isDateNotWithinNextNbDays(referenceDate, new Date('2026-11-18T00:00:00Z'), 15)).toBe(
      true
    )
  })
})
