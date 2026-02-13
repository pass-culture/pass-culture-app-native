import { EligibilityType } from 'api/gen'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { getAge } from 'shared/user/getAge'

type UserStatus = Partial<{
  NON_BENEFICIARY_ELIGIBLE: boolean
  NON_BENEFICIARY_NON_ELIGIBLE: boolean
  BENEFICIARY_ELIGIBLE: boolean
  BENEFICIARY_NON_ELIGIBLE: boolean
}>

type UserCategories = {
  FIFTEEN: UserStatus
  SIXTEEN: UserStatus
  SEVENTEEN: UserStatus
  EIGHTEEN: UserStatus
  GENERAL_PUBLIC: boolean
}

type Props = { user: UserProfileResponseWithoutSurvey }

export const getUserStatus = ({ user }: Props): UserCategories => {
  const age = getAge(user.birthDate)
  const IS_FIFTEEN = age === 15
  const IS_SIXTEEN = age === 16
  const IS_SEVENTEEN = age === 17
  const IS_EIGHTEEN = age === 18
  const IS_ABOVE_EIGHTEEN = Boolean(age && age > 18)
  const IS_UNDER_FIFTEEN = Boolean(age && age < 15)

  const IS_BENEFICIARY = user.isBeneficiary
  const IS_NOT_BENEFICIARY = !IS_BENEFICIARY
  const IS_GENERAL_PUBLIC = IS_NOT_BENEFICIARY && (IS_ABOVE_EIGHTEEN || IS_UNDER_FIFTEEN)

  const IS_ELIGIBLE_V3 = user.eligibility === EligibilityType['age-17-18']
  const IS_ELIGIBLE_FREE_V3 = user.eligibility === EligibilityType['free']

  return {
    FIFTEEN: { NON_BENEFICIARY_ELIGIBLE: IS_FIFTEEN && IS_NOT_BENEFICIARY && IS_ELIGIBLE_FREE_V3 },
    SIXTEEN: { NON_BENEFICIARY_ELIGIBLE: IS_SIXTEEN && IS_NOT_BENEFICIARY && IS_ELIGIBLE_FREE_V3 },
    SEVENTEEN: { NON_BENEFICIARY_ELIGIBLE: IS_SEVENTEEN && IS_NOT_BENEFICIARY && IS_ELIGIBLE_V3 },
    EIGHTEEN: { NON_BENEFICIARY_ELIGIBLE: IS_EIGHTEEN && IS_NOT_BENEFICIARY && IS_ELIGIBLE_V3 },
    GENERAL_PUBLIC: IS_GENERAL_PUBLIC,
  }
}
