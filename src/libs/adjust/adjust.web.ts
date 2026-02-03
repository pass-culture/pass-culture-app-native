import { TrackingStatus } from 'libs/adjust/adjust'

import { AdjustEvents } from './adjustEvents'
import { Adjust as AdjustType } from './types'

export const Adjust: AdjustType = {
  initOrEnable: (_calledFromConsentChange?: boolean) => undefined,
  disable: () => undefined,
  gdprForgetMe: () => undefined,
  logEvent: (_event: AdjustEvents) => undefined,
  TrackingStatus: TrackingStatus,
  getOrRequestAppTrackingAuthorization: () => undefined,
}
