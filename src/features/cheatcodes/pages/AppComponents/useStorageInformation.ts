import { useEffect, useState } from 'react'

import { storage } from 'libs/storage'

export const useStorageInformation = () => {
  const [campaign, setCampaign] = useState<string | null>(null)
  const [source, setSource] = useState<string | null>(null)
  const [medium, setMedium] = useState<string | null>(null)

  useEffect(() => {
    storage.readString('traffic_campaign').then(setCampaign)
    storage.readString('traffic_source').then(setSource)
    storage.readString('traffic_medium').then(setMedium)
  }, [])

  return { campaign, source, medium }
}
