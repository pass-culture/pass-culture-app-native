import { DEFAULT_EURO_TO_CFP_RATE } from 'libs/firebase/firestore/exchangeRates/useGetEuroToCFPRate'

import { convertEuroToCFP } from './convertEuroToCFP'

describe('convertEuroToCFP', () => {
  it('should convert and round up 300€ correctly', () => {
    const result = convertEuroToCFP(300, DEFAULT_EURO_TO_CFP_RATE)

    expect(result).toBe(35844)
  })

  it('should convert and round up 30€ correctly', () => {
    const result = convertEuroToCFP(30, DEFAULT_EURO_TO_CFP_RATE)

    expect(result).toBe(3585)
  })

  it('should convert and round up 20€ correctly', () => {
    const result = convertEuroToCFP(20, DEFAULT_EURO_TO_CFP_RATE)

    expect(result).toBe(2390)
  })
})
