import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { UserProfile } from 'features/share/types'

export const isFreeBeneficiary = (user?: UserProfile) => {
  if (!user) return false
  return user.creditType === UserCreditType.CREDIT_V3_FREE
}
