import { useEffect, useState } from 'react'

import { storage } from 'libs/storage'

export const useBonificationBannerVisibility = () => {
  const [hasClosedBonificationBanner, setHasClosedBonificationBanner] = useState(false)

  const getStorage = () => {
    return storage.readObject('has_closed_bonification_banner')
  }

  const onCloseBanner = () => {
    setHasClosedBonificationBanner(true)
    void storage.saveObject('has_closed_bonification_banner', true)
  }

  useEffect(() => {
    const checkBannerStatus = async () => {
      const result = await getStorage()
      setHasClosedBonificationBanner(!!result)
    }

    void checkBannerStatus()
  }, [])

  return { hasClosedBonificationBanner, onCloseBanner }
}
