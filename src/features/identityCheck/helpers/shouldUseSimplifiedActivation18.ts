import { SubscriptionStepperResponseV3 } from 'api/gen'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserProfile } from 'features/share/types'

type Params = {
  enableSimplifiedActivation18: boolean
  user?: Pick<UserProfile, 'eligibilityType' | 'domainsCredit'> | null
  underageOkIdentityCheckMethod: SubscriptionStepperResponseV3['underageOkIdentityCheckMethod']
}

export const shouldUseSimplifiedActivation18 = ({
  enableSimplifiedActivation18,
  user,
  underageOkIdentityCheckMethod,
}: Params): boolean =>
  enableSimplifiedActivation18 &&
  user?.eligibilityType === UserEligibilityType.ELIGIBLE_CREDIT_V3_18 &&
  (user.domainsCredit?.all.initial ?? 0) > 0 &&
  (underageOkIdentityCheckMethod === 'ubble' ||
    underageOkIdentityCheckMethod === 'dms' ||
    underageOkIdentityCheckMethod === 'educonnect')
