import { useEffect } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { Adjust } from 'libs/adjust/adjust'
import { AdjustEvents } from 'libs/adjust/adjustEvents'
import { storage } from 'libs/storage'
import { getAge } from 'shared/user/getAge'

export const useBeneficiaryEvent = () => {
  const { user } = useAuthContext()
  const isBeneficiary = user?.isBeneficiary
  const birthDate = user?.birthDate

  useEffect(() => {
    if (isBeneficiary) {
      storage
        .readObject<boolean>('adjust_beneficiary_event_sent')
        .then((adjustBeneficiaryEventSent) => {
          if (!adjustBeneficiaryEventSent) {
            Adjust.logEvent(AdjustEvents.COMPLETE_BENEFICIARY)

            const userAge = getAge(birthDate)
            if (userAge && userAge < 18) Adjust.logEvent(AdjustEvents.COMPLETE_BENEFICIARY_UNDERAGE)
            if (userAge && userAge >= 18) Adjust.logEvent(AdjustEvents.COMPLETE_BENEFICIARY_18)

            storage.saveObject('adjust_beneficiary_event_sent', true).finally(() => undefined)
          }
        })
        .catch((_) => undefined)
    }
  }, [isBeneficiary, birthDate])
}
