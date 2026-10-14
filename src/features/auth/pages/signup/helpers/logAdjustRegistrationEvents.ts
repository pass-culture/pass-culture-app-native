import { Adjust } from 'libs/adjust/adjust'
import { AdjustEvents, AdjustEventsStorage } from 'libs/adjust/adjustEvents'
import { storage } from 'libs/storage'

export const logAdjustRegistrationEvents = (userAge?: number) => {
  Adjust.isEnabled(async (isEnabled) => {
    if (!isEnabled) return

    Adjust.logEvent(AdjustEvents.REGISTRATION)

    if (userAge && [15, 16, 17].includes(userAge)) {
      Adjust.logEvent(AdjustEvents.UNDERAGE_REGISTRATION)
    }

    if (userAge && [15, 16, 17, 18].includes(userAge)) {
      Adjust.logEvent(AdjustEvents.REGISTRATION_1518)
    }

    if (userAge && userAge === 18) {
      Adjust.logEvent(AdjustEvents.REGISTRATION_18)
    }

    // Keep in a isEnabled block to avoid skewed data because of users who had refused cookies but accepted them later.
    const adjustEventsStorage = await storage.readObject<AdjustEventsStorage>('adjust_events')
    const newAdjustEventsStorage: AdjustEventsStorage = {
      ...adjustEventsStorage,
      adjustRegistrationEventAlreadySent: true,
    }
    await storage.saveObject('adjust_events', newAdjustEventsStorage)
  })
}
