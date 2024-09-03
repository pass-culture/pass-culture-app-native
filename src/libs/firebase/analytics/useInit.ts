import { useEffect } from 'react'

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

  // If the user has clicked on marketing link 24h ago, we want to remove the marketing params
  if (campaignDate === null || (campaignDate && campaignDate < ago24Hours)) {
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
  }
  if (campaign && oldCampaigns.includes(campaign)) {
    eventMonitoring.captureException(new Error(`Old marketing campaign`), {
      extra: { campaignDate, campaign, content, gen, medium, source },
    })
  }
}

export const useInit = () => {
  const { campaignDate, campaign, content, gen, medium, source } = useUtmParams()

  useEffect(() => {
    setFirebaseParams(campaignDate, campaign, content, gen, medium, source)
  }, [campaign, campaignDate, content, gen, medium, source])
}
