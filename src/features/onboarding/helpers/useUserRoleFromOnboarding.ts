import { useState } from 'react'

import { NonEligible, UserOnboardingRole } from 'features/onboarding/enums'
import { storage } from 'libs/storage'

export const useUserRoleFromOnboarding = () => {
  // We need to use useState if we don't want to make this helper async
  const [onboardingRole, setOnboardingRole] = useState<UserOnboardingRole>(
    UserOnboardingRole.UNKNOWN
  )

  storage.readObject<number | string>('user_age').then((userOnboardingAge) => {
    //eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (userOnboardingAge) {
      case 18:
        setOnboardingRole(UserOnboardingRole.EIGHTEEN)
        break
      case NonEligible.UNDER_15:
      case NonEligible.UNDER_17:
      case 15:
      case 16:
      case 17:
        setOnboardingRole(UserOnboardingRole.UNDERAGE)
        break
      case NonEligible.OVER_18:
        setOnboardingRole(UserOnboardingRole.NON_ELIGIBLE)
        break
    }
  })

  return onboardingRole
}
