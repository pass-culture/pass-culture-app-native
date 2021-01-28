import mockdate from 'mockdate'

import {
  currentTimestamp,
  dateDiffInFullYears,
  formatToSlashedFrenchDate,
  isTimestampExpired,
} from './dates'

describe('currentTimestamp()', () => {
  it('should return timestamp corresponding to current time', () => {
    mockdate.set(new Date('2020-06-10T13:00:00Z'))
    expect(currentTimestamp()).toBe(1591794000)
  })
})

describe('isTimestampExpired()', () => {
  const timestamp = 1591794000 // corresponding date : 2020-06-10T13:00:00Z
  const expirationMargin = 300 // 5 minutes

  it('should return true if the timestamp has expired', () => {
    mockdate.set(new Date('2020-06-10T13:00:00Z'))
    expect(isTimestampExpired(timestamp)).toBe(true)
  })

  it('should return true if the timestamp has not expired but still is within the "expiration" margin', () => {
    mockdate.set(new Date('2020-06-10T12:58:00Z'))
    expect(isTimestampExpired(timestamp, expirationMargin)).toBe(true)
  })

  it('should return false if the timestamp has not expired and is not within the "expiration" margin', () => {
    mockdate.set(new Date('2020-06-10T12:54:00Z'))
    expect(isTimestampExpired(timestamp, expirationMargin)).toBe(false)
  })
})

describe('dateDiffInFullYears()', () => {
  it('should return the number of revoluted years between two dates', () => {
    let oldDate = new Date('2020-06-01T00:00:00Z')
    let newDate = new Date('2025-06-01T00:00:00Z')
    expect(dateDiffInFullYears(oldDate, newDate)).toBe(5)

    oldDate = new Date('2020-06-01T00:00:00Z')
    newDate = new Date('2025-05-01T00:00:00Z')
    expect(dateDiffInFullYears(oldDate, newDate)).toBe(4)

    oldDate = new Date('2020-06-01T00:00:00Z')
    newDate = new Date('2025-05-31T00:00:00Z')
    expect(dateDiffInFullYears(oldDate, newDate)).toBe(4)

    oldDate = new Date('2020-06-01T00:00:00Z')
    newDate = new Date('2025-05-31T23:59:59Z')
    expect(dateDiffInFullYears(oldDate, newDate)).toBe(4)
  })
})

describe('formatToSlashedFrenchDate()', () => {
  it('should return the date in the slashed format', () => {
    expect(formatToSlashedFrenchDate('2020-06-01T00:00:00Z')).toBe('01/06/2020')
  })
})
