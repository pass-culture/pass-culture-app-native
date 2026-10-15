import { Adjust as AdjustType } from 'libs/adjust/types'
import { AdjustEvents } from 'shared/adjust/adjustEvents'

export const Adjust: AdjustType = {
  initOrEnable: (_calledBecauseOfNewConsents?: boolean) => undefined,
  isEnabled: () => undefined,
  disable: () => undefined,
  gdprForgetMe: () => undefined,
  logEvent: (_event: AdjustEvents) => undefined,
}
