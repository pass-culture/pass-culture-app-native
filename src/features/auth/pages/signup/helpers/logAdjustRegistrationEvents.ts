import { Adjust } from 'libs/adjust/adjust'
import { AdjustEvents } from 'libs/adjust/adjustEvents'

export const logAdjustRegistrationEvents = (userAge?: number) => {
  Adjust.logEvent(AdjustEvents.REGISTRATION)

  if (userAge && userAge < 18) {
    Adjust.logEvent(AdjustEvents.UNDERAGE_REGISTRATION)
  }

  if (userAge && userAge >= 18) {
    Adjust.logEvent(AdjustEvents.REGISTRATION_18)
  }
}
