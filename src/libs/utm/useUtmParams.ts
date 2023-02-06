import { useEffect, useState } from 'react'

import { storage } from 'libs/storage'
import { UtmParams } from 'libs/utm/types'

interface ExtendedUtmParams extends UtmParams {
  campaignDate?: Date | null
}

export const getCampaignDate = (time: string | null) =>
  time && !isNaN(new Date(parseInt(time)).getTime()) ? new Date(parseInt(time)) : null

export const useUtmParams = (): ExtendedUtmParams => {
  const [utmParams, setUtmParams] = useState<ExtendedUtmParams | null>(null)

  useEffect(() => {
    storage
      .readMultiString(['traffic_campaign', 'traffic_source', 'traffic_medium', 'campaign_date'])
      .then(([[, campaign], [, source], [, medium], [, time]]) => {
        const campaignDate = getCampaignDate(time)
        setUtmParams({ campaign, source, medium, campaignDate })
      })
  }, [])

  return utmParams || {}
}
