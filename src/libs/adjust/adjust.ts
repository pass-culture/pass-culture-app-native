import {
  Adjust as RNAdjust,
  AdjustConfig,
  AdjustThirdPartySharing,
  AdjustEvent,
} from 'react-native-adjust'

import { AdjustEvents } from 'libs/adjust/adjustEvents'
import { Adjust as AdjustType } from 'libs/adjust/types'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'

let hasAlreadyBeenInitialized = false

// This method is only for tests, to be able to test the initOrEnable method multiple times in the same test suite
export const resetHasAlreadyBeenInitializedForTests = () => {
  hasAlreadyBeenInitialized = false
}

const requestAppTrackingAuthorizationIfNeeded = () => {
  const NOT_DETERMINED = 3

  RNAdjust.getAppTrackingAuthorizationStatus((status) => {
    if (status === NOT_DETERMINED) {
      RNAdjust.requestAppTrackingAuthorization((_status) => undefined)
    }
  })
}

const enableThirdPartySharing = () => {
  const adjustThirdPartySharing = new AdjustThirdPartySharing(true)
  // Google consents must be explicitly defined.
  adjustThirdPartySharing.addGranularOption('google_dma', 'eea', '1')
  adjustThirdPartySharing.addGranularOption('google_dma', 'ad_personalization', '0')
  adjustThirdPartySharing.addGranularOption('google_dma', 'ad_user_data', '1')
  RNAdjust.trackThirdPartySharing(adjustThirdPartySharing)
}

const disableThirdPartySharing = () => {
  RNAdjust.trackThirdPartySharing(new AdjustThirdPartySharing(false))
}

const initOrEnable = (calledBecauseOfNewConsents = false) => {
  if (!process.env.JEST && __DEV__) return

  enableThirdPartySharing()

  if (hasAlreadyBeenInitialized) {
    RNAdjust.enable()
  } else {
    const adjustConfig = new AdjustConfig(
      env.ADJUST_APP_TOKEN,
      env.ENV === 'production'
        ? AdjustConfig.EnvironmentProduction
        : AdjustConfig.EnvironmentSandbox
    )

    // If the att status is not yet available, the SDK can buffer the data for 60 seconds before sending it to the server.
    // At the end of the 60 seconds or when the status becomes available, the data are sent with or without the IDFA depending on the status
    adjustConfig.setAttConsentWaitingInterval(60)

    // // If we want log for debug. Level info by default
    // adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose)

    RNAdjust.initSdk(adjustConfig)
    hasAlreadyBeenInitialized = true

    requestAppTrackingAuthorizationIfNeeded()

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    analytics.logCampaignTrackerEnabled()
  }

  if (calledBecauseOfNewConsents) {
    // This method allows the user's consent to be recorded by the Adjust server, which then sets a timestamp for the consents in order to calculate data usage periods related to the GDPR.
    // The SDK doesn't need this method at each startup.
    // Therefore, this method must called each time the user accepts the consents, but not at every startup, otherwise a new consents timestamp will be created on server.
    RNAdjust.trackMeasurementConsent(true)
  }
}

const disable = () => {
  if (!process.env.JEST && __DEV__) return

  RNAdjust.isEnabled((isEnabled) => {
    if (isEnabled) {
      // Remove consent from Adjust server
      RNAdjust.trackMeasurementConsent(false)
      disableThirdPartySharing()

      // we use settimeout as a compromise to try to allow time for the above calls to complete while still ensuring we disable quickly
      setTimeout(() => {
        RNAdjust.disable()
      }, 1000)
    }
  })
}

const logEvent = (event: AdjustEvents) => {
  if (!process.env.JEST && __DEV__) return

  const adjustEvent = new AdjustEvent(event)
  RNAdjust.trackEvent(adjustEvent)
}

export const Adjust: AdjustType = {
  initOrEnable,
  isEnabled: RNAdjust.isEnabled,
  disable,
  gdprForgetMe: RNAdjust.gdprForgetMe,
  logEvent,
}
