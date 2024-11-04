import { useEffect, useState } from 'react'

import { getExchangeRates } from 'libs/firebase/firestore/exchangeRates/getExchangeRates'

export const DEFAULT_EURO_TO_CFP_RATE = 119.48

export const useGetEuroToCFPRate = (): number => {
  const [euroToCFPRate, setEuroToCFPRate] = useState(DEFAULT_EURO_TO_CFP_RATE)

  useEffect(() => {
    const subscriber = getExchangeRates((currentRate) => {
      if (currentRate === undefined) {
        setEuroToCFPRate(DEFAULT_EURO_TO_CFP_RATE)
      } else {
        setEuroToCFPRate(currentRate)
      }
    })

    // Stop listening for updates when no longer required
    return () => subscriber()
  }, [])

  return euroToCFPRate
}
