import { handleTooManyCount } from 'shared/handleTooManyCount/handleTooManyCount'

describe('handleTooManyCount', () => {
  it('should return correct labels when count is less than COUNT_MAX', () => {
    const count = 50
    const result = handleTooManyCount(count)

    expect(result).toEqual({
      accessibilityLabel: '50',
      fullCountLabel: '50',
    })
  })

  it('should return correct labels when count is equal to COUNT_MAX', () => {
    const count = 100
    const result = handleTooManyCount(count)

    expect(result).toEqual({
      accessibilityLabel: '100',
      fullCountLabel: '99+',
    })
  })

  it('should return correct labels when count is greater than COUNT_MAX', () => {
    const count = 150
    const result = handleTooManyCount(count)

    expect(result).toEqual({
      accessibilityLabel: '150',
      fullCountLabel: '99+',
    })
  })

  it('should return correct labels when count is zero', () => {
    const count = 0
    const result = handleTooManyCount(count)

    expect(result).toEqual({
      accessibilityLabel: '0',
      fullCountLabel: '0',
    })
  })

  it('should return correct labels when count is negative', () => {
    const count = -10
    const result = handleTooManyCount(count)

    expect(result).toEqual({
      accessibilityLabel: '-10',
      fullCountLabel: '-10',
    })
  })

  it('should return "0" for displayedCount when count is undefined', () => {
    const count = undefined
    const result = handleTooManyCount(count)

    expect(result).toEqual({
      accessibilityLabel: '0',
      fullCountLabel: '0',
    })
  })

  it('should return "0" for displayedCount when count is null', () => {
    const count = null
    const result = handleTooManyCount(count)

    expect(result).toEqual({
      accessibilityLabel: '0',
      fullCountLabel: '0',
    })
  })
})
