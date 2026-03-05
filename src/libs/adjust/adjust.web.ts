import { AdjustEvents } from './adjustEvents'
import { Adjust as AdjustType } from './types'

export const Adjust: AdjustType = {
  initOrEnable: (_calledBecauseOfNewConsents?: boolean) => undefined,
  isEnabled: () => undefined,
  disable: () => undefined,
  gdprForgetMe: () => undefined,
  logEvent: (_event: AdjustEvents) => undefined,
}
