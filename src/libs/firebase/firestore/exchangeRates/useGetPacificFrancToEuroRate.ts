import { useEffect, useState } from 'react'

import { getExchangeRates } from 'libs/firebase/firestore/exchangeRates/getExchangeRates'

export const DEFAULT_PACIFIC_FRANC_TO_EURO_RATE = 0.00838

export const useGetPacificFrancToEuroRate = (): number => {
  const [pacificFrancToEuroRate, setPacificFrancToEuroRate] = useState(
    DEFAULT_PACIFIC_FRANC_TO_EURO_RATE
  )

  useEffect(() => {
    const subscriber = getExchangeRates((currentRate) => {
      if (currentRate === undefined) {
        setPacificFrancToEuroRate(DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)
      } else {
        setPacificFrancToEuroRate(currentRate)
      }
    })

    // Stop listening for updates when no longer required
    return () => subscriber()
  }, [])

  return pacificFrancToEuroRate
}
