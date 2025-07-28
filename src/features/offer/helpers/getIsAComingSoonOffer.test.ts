import mockdate from 'mockdate'

import { getIsAComingSoonOffer } from './getIsAComingSoonOffer'

describe('getIsAComingSoonOffer', () => {
  const fixedNow = new Date('2025-07-28T12:00:00Z')

  beforeAll(() => {
    mockdate.set(fixedNow)
  })

  it('should return true if date is in the future', () => {
    const futureDate = '2025-07-28T12:30:00Z'

    expect(getIsAComingSoonOffer(futureDate)).toBe(true)
  })

  it('should return false if date is in the past', () => {
    const pastDate = '2025-07-28T11:30:00Z'

    expect(getIsAComingSoonOffer(pastDate)).toBe(false)
  })

  it('should return true if date is null or undefined', () => {
    expect(getIsAComingSoonOffer(null)).toBe(false)
    expect(getIsAComingSoonOffer(undefined)).toBe(false)
  })
})
