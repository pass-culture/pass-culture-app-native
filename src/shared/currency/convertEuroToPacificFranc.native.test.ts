import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'

import { convertEuroToPacificFranc, RoundUnit } from './convertEuroToPacificFranc'

describe('convertEuroToPacificFranc', () => {
  describe('when rounding is NONE', () => {
    it('should convert 1€ without rounding', () => {
      const result = convertEuroToPacificFranc(1, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)

      expect(result).toBe(119.33)
    })

    it('should convert 300€ without rounding', () => {
      const result = convertEuroToPacificFranc(300, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)

      expect(result).toBe(35799.52)
    })

    it('should convert 30€ without rounding', () => {
      const result = convertEuroToPacificFranc(30, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)

      expect(result).toBe(3579.95)
    })

    it('should convert 20€ without rounding', () => {
      const result = convertEuroToPacificFranc(20, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)

      expect(result).toBe(2386.63)
    })

    it('should convert 8.38€ without rounding', () => {
      const result = convertEuroToPacificFranc(8.38, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)

      expect(result).toBe(1000)
    })
  })

  describe('when rounding is UNITS', () => {
    it('should convert and round 1€ to the nearest unit', () => {
      const result = convertEuroToPacificFranc(
        1,
        DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
        RoundUnit.UNITS
      )

      expect(result).toBe(120)
    })

    it('should convert and round 300€ to the nearest unit', () => {
      const result = convertEuroToPacificFranc(
        300,
        DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
        RoundUnit.UNITS
      )

      expect(result).toBe(35800)
    })

    it('should convert and round 30€ to the nearest unit', () => {
      const result = convertEuroToPacificFranc(
        30,
        DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
        RoundUnit.UNITS
      )

      expect(result).toBe(3580)
    })

    it('should convert and round 20€ to the nearest unit', () => {
      const result = convertEuroToPacificFranc(
        20,
        DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
        RoundUnit.UNITS
      )

      expect(result).toBe(2387)
    })

    it('should convert and round 8.38€ to the nearest unit', () => {
      const result = convertEuroToPacificFranc(
        8.38,
        DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
        RoundUnit.UNITS
      )

      expect(result).toBe(1000)
    })
  })
})
