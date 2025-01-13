import { onlineManager, useQuery } from 'react-query'

import { getCookiesChoice } from 'features/cookies/helpers/useCookies'
import { getCookiesLastUpdate } from 'libs/firebase/firestore/getCookiesLastUpdate'
import { getAppBuildVersion } from 'libs/packageJson'

export interface CookiesLastUpdate {
  lastUpdated: Date
  lastUpdateBuildVersion: number
}

export const useIsCookiesListUpToDate = () => {
  const fetchCookiesData = async () => {
    const [consent, lastUpdate] = await Promise.all([getCookiesChoice(), getCookiesLastUpdate()])
    return { consent, lastUpdate }
  }

  const { data } = useQuery('COOKIES_DATA', fetchCookiesData, {
    enabled: onlineManager.isOnline(),
  })

  const cookiesLastUpdate = data?.lastUpdate
  const consentBuildVersion = data?.consent?.buildVersion
  const consentChoiceDatetime = data?.consent?.choiceDatetime

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
  }
}
