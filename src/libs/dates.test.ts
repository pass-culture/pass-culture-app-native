import mockdate from 'mockdate'

import { currentTimestamp, isTimestampExpired } from './dates'

describe('currentTimestamp()', () => {
  it('should return timestamp corresponding to current time', () => {
    mockdate.set(new Date('2020-06-10T13:00:00Z')) // corresponding timestamp : 1591794000
    expect(currentTimestamp()).toBe(1591794000)
  })
})

describe('isTimestampExpired()', () => {
  const timestamp = 1591794000 // corresponding date : 2020-06-10T13:00:00Z

  it('should return true if the time has expired', () => {
    mockdate.set(new Date('2020-06-10T13:00:00Z'))
    expect(isTimestampExpired(timestamp)).toBe(true)
  })

  it('should return true if the time has not expired but still is within the "expiration" margin', () => {
    mockdate.set(new Date('2020-06-10T12:58:00Z'))
    const margin = 300 // 5 minutes
    expect(isTimestampExpired(timestamp, margin)).toBe(true)
  })

  it('should return false if the time has not expired and is not within the "expiration" margin', () => {
    mockdate.set(new Date('2020-06-10T12:54:00Z'))
    const margin = 300 // 5 minutes
    expect(isTimestampExpired(timestamp, margin)).toBe(false)
  })
})
