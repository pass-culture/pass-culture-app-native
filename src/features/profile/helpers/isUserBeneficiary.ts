import { UserProfileResponse } from 'api/gen/api'

export function isUserBeneficiary(user: UserProfileResponse): boolean {
  return user.isBeneficiary
}
