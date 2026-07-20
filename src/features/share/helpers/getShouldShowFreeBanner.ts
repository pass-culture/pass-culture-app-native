import { SubscriptionStatus } from 'api/gen'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'

const ELIGIBLE_FREE_BENEFICIARY_TYPES: ReadonlySet<UserEligibilityType> = new Set([
  UserEligibilityType.ELIGIBLE_CREDIT_V2_16,
  UserEligibilityType.ELIGIBLE_CREDIT_V3_16,
  UserEligibilityType.ELIGIBLE_CREDIT_V3_15,
])

export const getShouldShowEligibleFreeBanner = (
  eligibilityType?: UserEligibilityType,
  subscriptionStatus?: SubscriptionStatus | null
) => {
  return (
    eligibilityType !== undefined &&
    ELIGIBLE_FREE_BENEFICIARY_TYPES.has(eligibilityType) &&
    subscriptionStatus === 'has_to_complete_subscription'
  )
}
