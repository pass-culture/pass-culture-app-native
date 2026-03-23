import { useEffect } from 'react'

import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { Adjust } from 'libs/adjust/adjust'
import { AdjustEvents } from 'libs/adjust/adjustEvents'
import { storage } from 'libs/storage'
import { getAge } from 'shared/user/getAge'

export const useAdjustBeneficiaryEvent = (user?: UserProfileResponseWithoutSurvey) => {
  useEffect(() => {
    if (user?.isBeneficiary) {
      // beneficiary events will be logged only once so we prefer check that Adjust is enabled to avoid losing the event
      Adjust.isEnabled((isEnabled) => {
        if (isEnabled) {
          storage
            .readObject<boolean>('adjust_beneficiary_event_sent')
            .then((adjustBeneficiaryEventSent) => {
              if (!adjustBeneficiaryEventSent) {
                Adjust.logEvent(AdjustEvents.COMPLETE_BENEFICIARY)

                const userAge = getAge(user?.birthDate)
                if (userAge && userAge < 18)
                  Adjust.logEvent(AdjustEvents.COMPLETE_BENEFICIARY_UNDERAGE)
                if (userAge && userAge >= 18) Adjust.logEvent(AdjustEvents.COMPLETE_BENEFICIARY_18)

                void storage.saveObject('adjust_beneficiary_event_sent', true)
              }
            })
            .catch((_) => undefined)
        }
      })
    }
  }, [user?.isBeneficiary, user?.birthDate])
}
