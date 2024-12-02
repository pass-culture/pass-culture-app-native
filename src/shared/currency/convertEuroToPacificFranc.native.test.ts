import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'

import { convertEuroToPacificFranc, RoundUnit } from './convertEuroToPacificFranc'

describe('convertEuroToPacificFranc', () => {
  describe('when rounding is NONE', () => {
    it('should convert 1€ into 119.33F when without rounding', () => {
      const result = convertEuroToPacificFranc(1, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)

      expect(result).toBe(119.33)
    })

    it('should convert 300€ into 35799.52F when without rounding', () => {
      const result = convertEuroToPacificFranc(300, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)

      expect(result).toBe(35799.52)
    })

    it('should convert 30€ into 3579.95F when without rounding', () => {
      const result = convertEuroToPacificFranc(30, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)

      expect(result).toBe(3579.95)
    })

    it('should convert 20€ into 2386.63F when without rounding', () => {
      const result = convertEuroToPacificFranc(20, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)

      expect(result).toBe(2386.63)
    })

    it('should convert 8.38€ into 1000F when without rounding', () => {
      const result = convertEuroToPacificFranc(8.38, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)

      expect(result).toBe(1000)
    })

    it('should convert and round 10€ into 1193.31F when without rounding', () => {
      const result = convertEuroToPacificFranc(10, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)

      expect(result).toBe(1193.31)
    })
  })

  describe('when rounding is UNITS', () => {
    it('should convert and round 1€ into 120F when to the nearest multiple of 5 unit', () => {
      const result = convertEuroToPacificFranc(
        1,
        DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
        RoundUnit.UNITS
      )

      expect(result).toBe(120)
    })

    it('should convert and round 300€ into 35800F when to the nearest multiple of 5 unit', () => {
      const result = convertEuroToPacificFranc(
        300,
        DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
        RoundUnit.UNITS
      )

      expect(result).toBe(35800)
    })

    it('should convert and round 30€ into 3580F when to the nearest multiple of 5 unit', () => {
      const result = convertEuroToPacificFranc(
        30,
        DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
        RoundUnit.UNITS
      )

      expect(result).toBe(3580)
    })

    it('should convert and round 20€ into 2385F when to the nearest multiple of 5 unit', () => {
      const result = convertEuroToPacificFranc(
        20,
        DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
        RoundUnit.UNITS
      )

      expect(result).toBe(2385)
    })

    it('should convert and round 8.38€ into 1000F when to the nearest multiple of 5 unit', () => {
      const result = convertEuroToPacificFranc(
        8.38,
        DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
        RoundUnit.UNITS
      )

      expect(result).toBe(1000)
    })

    it('should convert and round 10€ into 1195F into to the nearest multiple of 5 unit', () => {
      const result = convertEuroToPacificFranc(
        10,
        DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
        RoundUnit.UNITS
      )

      expect(result).toBe(1195)
    })
  })
})
