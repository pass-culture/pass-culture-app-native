import { useEffect, useState } from 'react'

import { getCookiesChoice } from 'features/cookies/helpers/useCookies'
import { useCookiesConsentStore } from 'features/cookies/store/cookiesConsentStore'
import { getCookiesLastUpdate } from 'libs/firebase/firestore/getCookiesLastUpdate'
import { getAppBuildVersion } from 'libs/packageJson'

export interface CookiesLastUpdate {
  lastUpdated: Date
  lastUpdateBuildVersion: number
}

export const useIsCookiesListUpToDate = () => {
  const [cookiesLastUpdate, setCookiesLastUpdate] = useState<CookiesLastUpdate>()
  const [consentBuildVersion, setConsentBuildVersion] = useState<number>()
  const [consentChoiceDatetime, setConsentChoiceDatetime] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Watch the store to reload when cookies consent changes
  const cookiesConsentState = useCookiesConsentStore((state) => state.cookiesConsent)

  // TODO(PC-34248): refacto cookies management
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const [consent, lastUpdate] = await Promise.all([getCookiesChoice(), getCookiesLastUpdate()])
      setIsLoading(false)

      if (consent) {
        setConsentBuildVersion(consent.buildVersion)
        setConsentChoiceDatetime(consent.choiceDatetime)
      }
      if (lastUpdate) {
        setCookiesLastUpdate(lastUpdate)
      }
    }

    void fetchData()
  }, [cookiesConsentState])

  const isUpToDate = () => {
    // If no data from Firestore, consider that the cookie list is up to date
    if (cookiesLastUpdate === undefined) return true

    const { lastUpdated, lastUpdateBuildVersion } = cookiesLastUpdate
    if (!consentBuildVersion || !consentChoiceDatetime) {
      return false
    }

    // If app is updated with new cookies
    if (getAppBuildVersion() >= lastUpdateBuildVersion) {
      // And cookies consent indicates an older version, then the list is outdated
      if (consentBuildVersion < lastUpdateBuildVersion) {
        return false
      }
      // If update date is in the future, consider  that the cookie list is up to date
      if (lastUpdated > new Date()) {
        return true
      }
      // If cookies consent indicates same version, then compare date update with consent choice date
      if (consentBuildVersion === lastUpdateBuildVersion) {
        const choiceTime = new Date(consentChoiceDatetime)
        return choiceTime >= lastUpdated
      }
    }
    return true
  }

  return {
    isCookiesListUpToDate: isUpToDate(),
    cookiesLastUpdate,
    isLoading,
  }
}
