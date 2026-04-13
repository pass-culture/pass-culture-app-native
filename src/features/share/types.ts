import { SubscriptionStatus, UserProfileResponse } from 'api/gen'
import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { ShareContent } from 'libs/share/types'

export interface WebShareModalProps {
  visible: boolean
  headerTitle: string
  shareContent: ShareContent
  dismissModal: () => void
}

export enum ShareAppModalType {
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  BENEFICIARY = 'BENEFICIARY',
  ON_BOOKING_SUCCESS = 'ON_BOOKING_SUCCESS',
}

// Delete this type once omited objects are no longer in UserProfileResponse of api.gen
export type UserProfile = Omit<
  UserProfileResponse,
  'needsToFillCulturalSurvey' | 'depositType' | 'isBeneficiary' | 'status' | 'eligibility'
> & {
  subscriptionStatus?: SubscriptionStatus | null
  statusType: UserStatusType
  creditType: UserCreditType
  eligibilityType: UserEligibilityType
}
