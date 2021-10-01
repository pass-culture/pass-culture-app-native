import { useEffect, useState } from 'react'

import { storage } from 'libs/storage'
import { UtmParams } from 'libs/utm/types'

export const useUtmParams = (): UtmParams => {
  const [utmParams, setUtmParams] = useState<UtmParams | null>(null)

  useEffect(() => {
    storage
      .readMultiString(['traffic_campaign', 'traffic_source', 'traffic_medium'])
      .then(([[, campaign], [, source], [, medium]]) => {
        setUtmParams({ campaign, source, medium })
      })
  }, [])

  return utmParams || {}
}
