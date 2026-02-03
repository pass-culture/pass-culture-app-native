import { Adjust, TrackingStatus } from './adjust'
import { AdjustEvents } from './adjustEvents'

export interface Adjust {
  initOrEnable: (calledFromConsentChange?: boolean) => void
  disable: () => void
  gdprForgetMe: () => void
  logEvent: (event: AdjustEvents) => void
  TrackingStatus: typeof TrackingStatus
  getOrRequestAppTrackingAuthorization: () => void
}
