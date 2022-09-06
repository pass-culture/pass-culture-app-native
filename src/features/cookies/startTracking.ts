import { amplitude } from 'libs/amplitude'
import { analytics } from 'libs/firebase/analytics'

export const startTracking = (enabled: boolean) => {
  if (enabled) {
    amplitude().enableCollection()
    analytics.enableCollection()
  } else {
    amplitude().disableCollection()
    analytics.disableCollection()
  }
}
