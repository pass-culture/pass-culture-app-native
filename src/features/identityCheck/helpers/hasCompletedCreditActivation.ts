import { getShouldDisplayActivationFlow } from 'features/auth/helpers/getShouldDisplayActivationFlow'
import { UserProfile } from 'features/share/types'
import { hasOngoingCredit } from 'shared/user/getAvailableCredit'

export const hasCompletedCreditActivation = (user: UserProfile) =>
  !user.subscriptionStatus && !getShouldDisplayActivationFlow(user) && hasOngoingCredit(user)
