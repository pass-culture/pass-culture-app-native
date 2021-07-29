/* eslint-disable no-console */
const appsFlyer = {
  getAppsFlyerUID(callback: (error: Error | null, uid: string) => void) {
    console.log('appsflyers.getAppsFlyerUID()')
    const mockError = null
    const mockUid = '123'
    callback(mockError, mockUid)
  },
  initSdk(
    _options: {
      devKey: string
      isDebug: boolean
      appId: string
      onInstallConversionDataListener: boolean
      timeToWaitForATTUserAuthorization: number
    },
    _successCallback: () => void,
    _errorCallback: () => void
  ) {
    console.log('appsflyers.initSdk()')
  },
  async logEvent(eventName: string, eventValues: Record<string, unknown>): Promise<string> {
    console.log('web mock appsflyers.logEvent', eventName, eventValues)
    return 'someString'
  },
}

export default appsFlyer
