import { useEffect, useState } from 'react'

import { getCookiesChoice } from 'features/cookies/helpers/useCookies'
import { getCookiesLastUpdate } from 'libs/firebase/firestore/getCookiesLastUpdate'

import Package from '../../../../package.json'

export interface CookiesLastUpdate {
  lastUpdated: Date
  lastUpdateBuildVersion: number
}

export const useIsCookiesListUpToDate = () => {
  const [cookiesLastUpdate, setCookiesLastUpdate] = useState<CookiesLastUpdate>()
  const [consentBuildVersion, setConsentBuildVersion] = useState<number>()
  const [consentChoiceDatetime, setConsentChoiceDatetime] = useState<string>()

  useEffect(() => {
    getCookiesChoice().then((consent) => {
      if (consent) {
        setConsentBuildVersion(consent.buildVersion)
        setConsentChoiceDatetime(consent.choiceDatetime)
      }
    })

    getCookiesLastUpdate().then((lastUpdate) => {
      if (lastUpdate) setCookiesLastUpdate(lastUpdate)
    })
  }, [])

  // If no data from Firestore, consider that the cookie list is up to date
  if (cookiesLastUpdate === undefined) {
    return true
  }

  const { lastUpdated, lastUpdateBuildVersion } = cookiesLastUpdate

  // If no build version or consent choice date in localStorage, consider that the cookie list is outdated
  if (!consentBuildVersion || !consentChoiceDatetime) {
    return false
  }

  // If app is updated with new cookies
  if (Package.build >= lastUpdateBuildVersion) {
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
