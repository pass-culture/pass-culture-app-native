import { convertEuroToCents, convertCentsToEuros, RoundingMode } from './pricesConversion'

describe('convertEuroToCents', () => {
  it('should convert euros to cents without rounding (default mode)', () => {
    expect(convertEuroToCents(12.345)).toBe(1234.5)
    expect(convertEuroToCents(12)).toBe(1200)
  })

  it('should convert euros to cents and round down (FLOORED mode)', () => {
    expect(convertEuroToCents(12.345, RoundingMode.FLOORED)).toBe(1234)
    expect(convertEuroToCents(12.999, RoundingMode.FLOORED)).toBe(1299)
  })

  it('should handle zero euros correctly', () => {
    expect(convertEuroToCents(0)).toBe(0)
    expect(convertEuroToCents(0, RoundingMode.FLOORED)).toBe(0)
  })

  it('should handle negative euros correctly', () => {
    expect(convertEuroToCents(-12.345)).toBe(-1234.5)
    expect(convertEuroToCents(-12.345, RoundingMode.FLOORED)).toBe(-1235)
  })
})

describe('convertCentsToEuros', () => {
  it('should convert cents to euros without rounding (default mode)', () => {
    expect(convertCentsToEuros(1234)).toBe(12.34)
    expect(convertCentsToEuros(1200)).toBe(12)
  })

  it('should convert cents to euros and round down (FLOORED mode)', () => {
    expect(convertCentsToEuros(1234, RoundingMode.FLOORED)).toBe(12)
    expect(convertCentsToEuros(1299, RoundingMode.FLOORED)).toBe(12)
  })

  it('should handle zero cents correctly', () => {
    expect(convertCentsToEuros(0)).toBe(0)
    expect(convertCentsToEuros(0, RoundingMode.FLOORED)).toBe(0)
  })

  it('should handle negative cents correctly', () => {
    expect(convertCentsToEuros(-1234)).toBe(-12.34)
    expect(convertCentsToEuros(-1234, RoundingMode.FLOORED)).toBe(-13)
  })
})
