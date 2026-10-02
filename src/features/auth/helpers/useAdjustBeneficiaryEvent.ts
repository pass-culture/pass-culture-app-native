import { useEffect } from 'react'

import { UserProfile } from 'features/share/types'
import { Adjust } from 'libs/adjust/adjust'
import { AdjustEvents } from 'libs/adjust/adjustEvents'
import { storage } from 'libs/storage'
import { isCurrentOrFormerBeneficiary } from 'shared/user/checkStatusType'
import { getAge } from 'shared/user/getAge'

export const useAdjustBeneficiaryEvent = (user?: UserProfile) => {
  useEffect(
    function logAdjustBeneficiaryEvent() {
      if (!isCurrentOrFormerBeneficiary(user)) return

      // Beneficiary events are logged once per installation after Adjust is available.
      Adjust.isEnabled((isEnabled) => {
        if (!isEnabled) return

        void storage
          .readObject<boolean>('adjust_beneficiary_event_sent')
          .then((adjustBeneficiaryEventSent) => {
            const userAge = getAge(user?.birthDate)
            const isNewBeneficiary = adjustBeneficiaryEventSent === false

            if (adjustBeneficiaryEventSent === true) return

            Adjust.logEvent(AdjustEvents.COMPLETE_BENEFICIARY)
            if (isNewBeneficiary) Adjust.logEvent(AdjustEvents.NEW_BENEFICIARY)

            if (userAge && userAge < 18) {
              Adjust.logEvent(AdjustEvents.COMPLETE_BENEFICIARY_UNDERAGE)
              if (isNewBeneficiary) Adjust.logEvent(AdjustEvents.NEW_BENEFICIARY_UNDERAGE)
            }
            if (userAge && userAge >= 18) {
              Adjust.logEvent(AdjustEvents.COMPLETE_BENEFICIARY_18)
              if (isNewBeneficiary) Adjust.logEvent(AdjustEvents.NEW_BENEFICIARY_18)
            }

            void storage.saveObject('adjust_beneficiary_event_sent', true)
          })
          .catch(() => undefined)
      })
    },
    [user]
  )
}
