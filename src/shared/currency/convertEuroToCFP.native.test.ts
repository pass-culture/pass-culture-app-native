import { convertEuroToCFP, RoundUnit } from './convertEuroToCFP'

const EURO_TO_CFP_RATE = 119.48

describe('convertEuroToCFP', () => {
  describe('when rounding is NONE', () => {
    it('should convert 300€ without rounding', () => {
      const result = convertEuroToCFP(300, EURO_TO_CFP_RATE, RoundUnit.NONE)

      expect(result).toBe(35844) // 300 * 119.48 = 35844
    })

    it('should convert 30€ without rounding', () => {
      const result = convertEuroToCFP(30, EURO_TO_CFP_RATE, RoundUnit.NONE)

      // prettier-ignore
      expect(result).toBe(3584.40) // 30 * 119.48 = 3584.4
    })

    it('should convert 20€ without rounding', () => {
      const result = convertEuroToCFP(20, EURO_TO_CFP_RATE, RoundUnit.NONE)

      // prettier-ignore
      expect(result).toBe(2389.60) // 20 * 119.48 = 2389.6
    })

    it('should convert 150.5€ without rounding', () => {
      const result = convertEuroToCFP(150.5, EURO_TO_CFP_RATE, RoundUnit.NONE)

      expect(result).toBe(17981.74) // 150.5 * 119.48 = 17981.74
    })
  })

  describe('when rounding is UNITS', () => {
    it('should convert and round 300€ to the nearest unit', () => {
      const result = convertEuroToCFP(300, EURO_TO_CFP_RATE, RoundUnit.UNITS)

      expect(result).toBe(35844) // No additional rounding needed
    })

    it('should convert and round 30€ to the nearest unit', () => {
      const result = convertEuroToCFP(30, EURO_TO_CFP_RATE, RoundUnit.UNITS)

      expect(result).toBe(3585) // 3584.4 rounds up to 3585
    })

    it('should convert and round 20€ to the nearest unit', () => {
      const result = convertEuroToCFP(20, EURO_TO_CFP_RATE, RoundUnit.UNITS)

      expect(result).toBe(2390) // 2389.6 rounds up to 2390
    })

    it('should convert and round 150.5€ to the nearest unit', () => {
      const result = convertEuroToCFP(150.5, EURO_TO_CFP_RATE, RoundUnit.UNITS)

      expect(result).toBe(17982) // 17985.74 rounds up to 17982
    })
  })

  describe('when rounding is TENS', () => {
    it('should convert and round 300€ to the nearest ten', () => {
      const result = convertEuroToCFP(300, EURO_TO_CFP_RATE, RoundUnit.TENS)

      expect(result).toBe(35850) // 35844 rounds up to 35850
    })

    it('should convert and round 30€ to the nearest ten', () => {
      const result = convertEuroToCFP(30, EURO_TO_CFP_RATE, RoundUnit.TENS)

      expect(result).toBe(3590) // 3584.4 rounds up to 3590
    })

    it('should convert and round 20€ to the nearest ten', () => {
      const result = convertEuroToCFP(20, EURO_TO_CFP_RATE, RoundUnit.TENS)

      expect(result).toBe(2390) // 2389.6 rounds up to 2390
    })

    it('should convert and round 150.5€ to the nearest ten', () => {
      const result = convertEuroToCFP(150.5, EURO_TO_CFP_RATE, RoundUnit.TENS)

      expect(result).toBe(17990) // 17985.74 rounds up to 17990
    })
  })

  describe('when rounding is HUNDREDS', () => {
    it('should convert and round 300€ to the nearest hundred', () => {
      const result = convertEuroToCFP(300, EURO_TO_CFP_RATE, RoundUnit.HUNDREDS)

      expect(result).toBe(35900) // 35844 rounds up to 35900
    })

    it('should convert and round 30€ to the nearest hundred', () => {
      const result = convertEuroToCFP(30, EURO_TO_CFP_RATE, RoundUnit.HUNDREDS)

      expect(result).toBe(3600) // 3584.4 rounds up to 3600
    })

    it('should convert and round 20€ to the nearest hundred', () => {
      const result = convertEuroToCFP(20, EURO_TO_CFP_RATE, RoundUnit.HUNDREDS)

      expect(result).toBe(2400) // 2389.6 rounds up to 2400
    })

    it('should convert and round 150.5€ to the nearest hundred', () => {
      const result = convertEuroToCFP(150.5, EURO_TO_CFP_RATE, RoundUnit.HUNDREDS)

      expect(result).toBe(18000) // 17985.74 rounds up to 18000
    })
  })
})
