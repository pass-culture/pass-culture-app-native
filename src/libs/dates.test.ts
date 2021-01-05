import mockdate from 'mockdate'

import { currentTimestamp, isTimestampExpired } from './dates'

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
