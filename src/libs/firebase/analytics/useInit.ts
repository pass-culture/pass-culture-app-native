import { useEffect } from 'react'

import { removeGeneratedStorageKey } from 'features/cookies/helpers/removeGeneratedStorageKey'
import { generateUTMKeys } from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { eventMonitoring } from 'libs/monitoring'
import { useUtmParams } from 'libs/utm'

export const oldCampaigns = ['calendrieravent23', 'poissondavril24', 'saintvalentin24'] // campaigns that should no longer be triggered but visible in metabase

export const setFirebaseParams = async (
  campaignDate?: Date | null,
  campaign?: string | null,
  content?: string | null,
  gen?: string | null,
  medium?: string | null,
  source?: string | null
) => {
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
    eventMonitoring.addBreadcrumb({ message: 'before setDefaultEventParameters to null' })
    await firebaseAnalytics.setDefaultEventParameters(marketingParams)
    eventMonitoring.addBreadcrumb({ message: 'after setDefaultEventParameters to null' })

    // Remove utm params from storage
    generateUTMKeys.forEach((key) => removeGeneratedStorageKey(key))
  }

  const isOldCampaign = campaign && oldCampaigns.includes(campaign)
  if (isOldCampaign) {
    eventMonitoring.captureException(new Error(`Old marketing campaign`), {
      extra: { campaignDate, isCampaignOlderThan24h, campaign, content, gen, medium, source },
    })
  }
}

export const useInit = () => {
  const { campaignDate, campaign, content, gen, medium, source } = useUtmParams()

  useEffect(() => {
    setFirebaseParams(campaignDate, campaign, content, gen, medium, source)
  }, [campaign, campaignDate, content, gen, medium, source])
}
