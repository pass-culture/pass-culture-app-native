import { AdjustEvents } from './adjustEvents'

export interface Adjust {
  initOrEnable: (calledBecauseOfNewConsents?: boolean) => void
  isEnabled: (callback: (enabled: boolean) => void) => void
  disable: () => void
  gdprForgetMe: () => void
  logEvent: (event: AdjustEvents) => void
}
