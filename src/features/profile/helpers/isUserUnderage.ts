import { EligibilityType } from 'api/gen/api'
import { UserProfile } from 'features/share/types'

export const isUserUnderage = (user?: UserProfile) => user?.eligibility === EligibilityType.underage
