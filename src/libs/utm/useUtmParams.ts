import { useEffect, useState } from 'react'

import { storage } from 'libs/storage'
import { UtmParams } from 'libs/utm/types'

interface ExtendedUtmParams extends UtmParams {
  campaignDate?: Date | null
}

export const getCampaignDate = (time: string | null) =>
  time && !Number.isNaN(new Date(Number.parseInt(time)).getTime())
    ? new Date(Number.parseInt(time))
    : null

export const useUtmParams = (): ExtendedUtmParams => {
  const [utmParams, setUtmParams] = useState<ExtendedUtmParams | null>(null)

  useEffect(() => {
    storage
      .readMultiString([
        'traffic_gen',
        'traffic_campaign',
        'traffic_content',
        'traffic_source',
        'traffic_medium',
        'campaign_date',
      ])
      // @ts-expect-error: because of noUncheckedIndexedAccess
      .then(([[, gen], [, campaign], [, content], [, source], [, medium], [, time]]) => {
        const campaignDate = getCampaignDate(time)
        setUtmParams({ gen, campaign, content, source, medium, campaignDate })
      })
  }, [])

  return utmParams || {}
}
