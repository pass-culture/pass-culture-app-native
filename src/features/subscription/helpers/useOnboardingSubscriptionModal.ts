import { useEffect } from 'react'

import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { analytics } from 'libs/analytics/provider'
import { storage } from 'libs/storage'

interface Args {
  isLoggedIn: boolean
  userStatusType?: UserStatusType
  showOnboardingSubscriptionModal: () => void
}

export const useOnboardingSubscriptionModal = ({
  isLoggedIn,
  userStatusType,
  showOnboardingSubscriptionModal,
}: Args) => {
  useEffect(() => {
    const displaySubscriptionModal = async () => {
      if (!isLoggedIn || userStatusType === UserStatusType.GENERAL_PUBLIC) return

      if (await storage.readObject<boolean>('has_seen_onboarding_subscription')) return

      const loggedInSessionCount = await storage.readObject<number>('logged_in_session_count')
      if (loggedInSessionCount === 3) {
        showOnboardingSubscriptionModal()
        await analytics.logConsultSubscriptionModal()
        await storage.saveObject('has_seen_onboarding_subscription', true)
      }
    }
    displaySubscriptionModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, userStatusType])
}
