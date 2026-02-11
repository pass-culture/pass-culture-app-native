import { getIsDepositExpired } from './getIsDepositExpired'

const NOW = new Date('2025-01-01T12:00:00Z')
jest.useFakeTimers()

describe('getIsDepositExpired', () => {
  beforeAll(() => jest.setSystemTime(NOW))

  it('should return true when depositExpirationDate is in the past', () => {
    const result = getIsDepositExpired({ depositExpirationDate: '2024-12-31T12:00:00Z' })

    expect(result).toBe(true)
  })

  it('should return false when depositExpirationDate is in the future', () => {
    const result = getIsDepositExpired({ depositExpirationDate: '2025-01-02T12:00:00Z' })

    expect(result).toBe(false)
  })

  it('should return false when depositExpirationDate is exactly now', () => {
    const result = getIsDepositExpired({ depositExpirationDate: '2025-01-01T12:00:00Z' })

    expect(result).toBe(false)
  })

  it('should return false when depositExpirationDate is null', () => {
    const result = getIsDepositExpired({ depositExpirationDate: null })

    expect(result).toBe(false)
  })

  it('should return false when depositExpirationDate is undefined', () => {
    const result = getIsDepositExpired({})

    expect(result).toBe(false)
  })
})
