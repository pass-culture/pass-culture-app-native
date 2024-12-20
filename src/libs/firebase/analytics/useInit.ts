import { useEffect } from 'react'

import { removeGeneratedStorageKey } from 'features/cookies/helpers/removeGeneratedStorageKey'
import { generateUTMKeys } from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { useUtmParams } from 'libs/utm'

export const setFirebaseParams = async (campaignDate?: Date | null) => {
  const ago24Hours = new Date()
  ago24Hours.setDate(ago24Hours.getDate() - 1)
  const isCampaignOlderThan24h = campaignDate && campaignDate < ago24Hours

  // If the user has clicked on marketing link 24h ago, we want to remove the marketing params
  if (campaignDate === null || isCampaignOlderThan24h) {
    const marketingParams = {
      traffic_campaign: null,
      traffic_content: null,
      traffic_gen: null,
      traffic_medium: null,
      traffic_source: null,
    }
    await firebaseAnalytics.setDefaultEventParameters(marketingParams)

    // Remove utm params from storage
    generateUTMKeys.forEach((key) => removeGeneratedStorageKey(key))
  }
}

export const useInit = () => {
  const { campaignDate } = useUtmParams()

  useEffect(() => {
    setFirebaseParams(campaignDate)
  }, [campaignDate])
}
