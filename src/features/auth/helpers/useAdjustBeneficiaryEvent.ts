import { useEffect } from 'react'

import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { UserProfile } from 'features/share/types'
import { Adjust } from 'libs/adjust/adjust'
import { storage } from 'libs/storage'
import { AdjustEvents, AdjustEventsStorage } from 'shared/adjust/adjustEvents'
import { isCurrentBeneficiary } from 'shared/user/checkStatusType'
import { getAge } from 'shared/user/getAge'

export const logAdjustBeneficiaryEvent = (user?: UserProfile) => {
  if (!user) return

  // Adjust must be available to avoid to miss the event because of race condition with Adjust init and user query
  // Check also isEnabled to avoid skewed data because of users who had refused cookies but accepted them much later.
  Adjust.isEnabled(async (isEnabled) => {
    if (!isEnabled) return

    const adjustEventsStorage = await storage.readObject<AdjustEventsStorage>('adjust_events')

    if (!isCurrentBeneficiary(user)) {
      // We use alreadySeenAsNotBeneficiary to know if the user has just become a beneficiary,
      // or if it is an existing beneficiary simply changing phones and detected here as a beneficiary
      const newAdjustEventsStorage: AdjustEventsStorage = {
        ...adjustEventsStorage,
        alreadySeenAsNotBeneficiary: true,
      }
      await storage.saveObject('adjust_events', newAdjustEventsStorage)

      return
    }

    // Beneficiary events are logged only once per installation (even if Adjust ignores it if resend)
    if (adjustEventsStorage?.adjustBeneficiaryEventAlreadySent) return

    // COMPLETE_BENEFICIARY event
    const userAge = getAge(user.birthDate)
    Adjust.logEvent(AdjustEvents.COMPLETE_BENEFICIARY)

    if (userAge && userAge < 18) {
      Adjust.logEvent(AdjustEvents.COMPLETE_BENEFICIARY_UNDERAGE)
    }

    if (userAge && userAge >= 18) {
      Adjust.logEvent(AdjustEvents.COMPLETE_BENEFICIARY_18)
    }

    // NEW_BENEFICIARY event
    if (adjustEventsStorage?.alreadySeenAsNotBeneficiary) {
      Adjust.logEvent(AdjustEvents.NEW_BENEFICIARY)

      if (user.creditType === UserCreditType.CREDIT_V3_FREE) {
        Adjust.logEvent(AdjustEvents.NEW_FREE_BENEFICIARY)
      }

      if (user.creditType === UserCreditType.CREDIT_V3_17) {
        Adjust.logEvent(AdjustEvents.NEW_BENEFICIARY_17)
      }

      if ([UserCreditType.CREDIT_V3_18, UserCreditType.CREDIT_V2_18].includes(user.creditType)) {
        Adjust.logEvent(AdjustEvents.NEW_BENEFICIARY_18)
      }
    }

    // NEW_BENEFICIARY_WITH_REGISTRATION
    if (adjustEventsStorage?.adjustRegistrationEventAlreadySent)
      Adjust.logEvent(AdjustEvents.NEW_BENEFICIARY_WITH_REGISTRATION)

    // Mark beneficiary event as sent
    const newAdjustEventsStorage: AdjustEventsStorage = {
      ...adjustEventsStorage,
      adjustBeneficiaryEventAlreadySent: true,
    }
    await storage.saveObject('adjust_events', newAdjustEventsStorage)
  })
}

export const useAdjustBeneficiaryEvent = (user?: UserProfile) => {
  useEffect(() => {
    logAdjustBeneficiaryEvent(user)
  }, [user])
}
