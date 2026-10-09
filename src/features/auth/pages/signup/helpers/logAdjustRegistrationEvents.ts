import { Adjust } from 'libs/adjust/adjust'
import { AdjustEvents } from 'libs/adjust/adjustEvents'
import { storage } from 'libs/storage'

export const logAdjustRegistrationEvents = async (userAge?: number) => {
  Adjust.logEvent(AdjustEvents.REGISTRATION)

  if (userAge && userAge < 18) {
    Adjust.logEvent(AdjustEvents.UNDERAGE_REGISTRATION)
  }

  if (userAge && userAge >= 18) {
    Adjust.logEvent(AdjustEvents.REGISTRATION_18)
  }

  const adjustBeneficiaryEventSent = await storage.readObject<boolean>(
    'adjust_beneficiary_event_sent'
  )
  if (adjustBeneficiaryEventSent === null) {
    await storage.saveObject('adjust_beneficiary_event_sent', false)
  }
}
