import { useEffect } from 'react'

import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { useUtmParams } from 'libs/utm'

export const setFirebaseParams = (campaignDate?: Date | null) => {
  const ago24Hours = new Date()
  ago24Hours.setDate(ago24Hours.getDate() - 1)

  // If the user has clicked on marketing link 24h ago, we want to remove the marketing params
  if (campaignDate && campaignDate < ago24Hours) {
    const marketingParams = {
      traffic_campaign: null,
      traffic_content: null,
      traffic_gen: null,
      traffic_medium: null,
      traffic_source: null,
    }
    firebaseAnalytics.setDefaultEventParameters(marketingParams)
  }
}

export const useInit = () => {
  const { campaignDate } = useUtmParams()

  useEffect(() => {
    setFirebaseParams(campaignDate)
  }, [campaignDate])
}
