import { UserProfileResponse } from 'api/gen'
import { UserCreditType, getCreditType } from 'features/auth/helpers/getCreditType'
import { UserEligibilityType, getEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserStatusType, getStatusType } from 'features/auth/helpers/getStatusType'

type UserProfileStateOutput = {
  statusType: UserStatusType
  creditType: UserCreditType
  eligibilityType: UserEligibilityType
}

export const getUserProfileState = (user: UserProfileResponse): UserProfileStateOutput => ({
  statusType: getStatusType(user),
  creditType: getCreditType(user),
  eligibilityType: getEligibilityType(user),
})
