import { useEffect } from 'react'

import { analytics } from 'libs/firebase/analytics/analytics'
import { useUtmParams } from 'libs/utm'

export const setFirebaseParams = (campaignDate?: Date | null) => {
  const ago24Hours = new Date()
  ago24Hours.setDate(ago24Hours.getDate() - 1)

  // If the user has clicked on marketing link 24h ago, we want to remove the marketing params
  if (campaignDate && campaignDate < ago24Hours) {
    analytics.setDefaultEventParameters(undefined)
  }
}

export const useInit = () => {
  const { campaignDate } = useUtmParams()

  useEffect(() => {
    setFirebaseParams(campaignDate)
  }, [campaignDate])
}
