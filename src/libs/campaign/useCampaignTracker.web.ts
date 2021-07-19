import { MonitoringError } from 'libs/errorMonitoring'

export const appsFlyer = {
  initSdk: () => null,
  getAppsFlyerUID: (cb: (error: Error, uid: string) => void) => cb,
  logEvent: () => null,
}

export const useCampaignTracker = () => null

export const getCustomerUniqueId = async (): Promise<string | undefined> => {
  const appsFlyerUserIdPromise: Promise<string | undefined> = new Promise((resolve, reject) => {
    const getAppsFlyerUIDCallback = (error: Error, uid: string) => {
      error && new MonitoringError(error.message, 'ApssFlyer_getUID') && reject(error)
      resolve(uid)
    }
    appsFlyer.getAppsFlyerUID(getAppsFlyerUIDCallback)
  })

  return await appsFlyerUserIdPromise
}
