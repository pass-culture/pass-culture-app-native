import { UserProfileResponse, EligibilityType } from 'api/gen/api'

export const isUserUnderage = (user?: UserProfileResponse) =>
  user?.eligibility === EligibilityType.underage
