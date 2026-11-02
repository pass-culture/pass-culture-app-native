import { parseThreshold } from './helpers'

describe('parseThreshold', () => {
  describe('percentage parsing', () => {
    it('should convert percentage to pixels using element height', () => {
      expect(parseThreshold('50%', 200)).toEqual({ value: 100 })
      expect(parseThreshold('25%', 400)).toEqual({ value: 100 })
    })

    it('should use default height when element height not provided', () => {
      const result = parseThreshold('50%')

      expect(result.value).toBeGreaterThan(0) // Don't test exact value since default might change
    })

    it('should handle edge case percentages', () => {
      expect(parseThreshold('0%', 100)).toEqual({ value: 0 })
      expect(parseThreshold('100%', 100)).toEqual({ value: 100 })
    })
  })

  describe('pixel values', () => {
    it('should return pixel values as-is', () => {
      expect(parseThreshold(50)).toEqual({ value: 50 })
      expect(parseThreshold(0)).toEqual({ value: 0 })
      expect(parseThreshold(-10)).toEqual({ value: -10 })
    })
  })
})
