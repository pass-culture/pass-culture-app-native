import { EligibilityType } from 'api/gen/api'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

export const isUserUnderage = (user?: UserProfileResponseWithoutSurvey) =>
  user?.eligibility === EligibilityType.underage
