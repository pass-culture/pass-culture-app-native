import { DepositType, EligibilityType, QFBonificationStatus, UserProfileResponse } from 'api/gen'
import { logUserEligibilityTypeFallback } from 'features/profile/helpers/logUserEligibilityTypeFallback'
import { getAge } from 'shared/user/getAge'

export enum UserEligibilityType {
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  ELIGIBLE_BONUS = 'ELIGIBLE_BONUS',
  ELIGIBLE_CREDIT_V1_18 = 'ELIGIBLE_CREDIT_V1_18',
  ELIGIBLE_CREDIT_V2_15 = 'ELIGIBLE_CREDIT_V2_15',
  ELIGIBLE_CREDIT_V2_16 = 'ELIGIBLE_CREDIT_V2_16',
  ELIGIBLE_CREDIT_V2_17 = 'ELIGIBLE_CREDIT_V2_17',
  ELIGIBLE_CREDIT_V2_18 = 'ELIGIBLE_CREDIT_V2_18',
  ELIGIBLE_CREDIT_V3_15 = 'ELIGIBLE_CREDIT_V3_15',
  ELIGIBLE_CREDIT_V3_16 = 'ELIGIBLE_CREDIT_V3_16',
  ELIGIBLE_CREDIT_V3_17 = 'ELIGIBLE_CREDIT_V3_17',
  ELIGIBLE_CREDIT_V3_18 = 'ELIGIBLE_CREDIT_V3_18',
}

export const getEligibilityType = (user: UserProfileResponse): UserEligibilityType => {
  const {
    birthDate,
    eligibility,
    qfBonificationStatus,
    depositType,
    isEligibleForBeneficiaryUpgrade,
  } = user
  const actualyNotPossibleInFrontend = false
  const isTooOldForThisTypeOfEligibility = false

  const age = getAge(birthDate)
  const isFifteen = age === 15
  const isSixteen = age === 16
  const isSeventeen = age === 17
  const isEighteenOrMore = age && age >= 18

  // CREDIT_V1
  const isEligibleCreditV1_18 = isTooOldForThisTypeOfEligibility

  // CREDIT_V2
  const isEligibleCreditV2_15 = actualyNotPossibleInFrontend
  const isEligibleCreditV2_16 = actualyNotPossibleInFrontend
  const isEligibleCreditV2_17 = actualyNotPossibleInFrontend
  const isEligibleCreditV2_18 = eligibility === EligibilityType['age-18']

  // CREDIT_V3
  const isEligibleCreditV3_free = eligibility === EligibilityType['free']
  const isEligibleCreditV3_15 = isEligibleCreditV3_free && isFifteen
  const isEligibleCreditV3_16 = isEligibleCreditV3_free && isSixteen
  const isEligibleCreditV3_17 = eligibility === EligibilityType['age-17-18'] && isSeventeen
  const isEligibleCreditV3_18 = eligibility === EligibilityType['age-17-18'] && isEighteenOrMore

  // BONUS
  const isCreditV3 = depositType === DepositType.GRANT_17_18
  const isNotEligibleForBeneficiaryUpgrade = !isEligibleForBeneficiaryUpgrade
  const isCreditV3_18 = isCreditV3 && isNotEligibleForBeneficiaryUpgrade && isEighteenOrMore
  const isNotEligibleBonus = qfBonificationStatus === QFBonificationStatus.not_eligible
  const isEligibleBonus = !isNotEligibleBonus && isCreditV3_18

  if (isEligibleBonus) return UserEligibilityType.ELIGIBLE_BONUS
  if (isEligibleCreditV1_18) return UserEligibilityType.ELIGIBLE_CREDIT_V1_18
  if (isEligibleCreditV2_15) return UserEligibilityType.ELIGIBLE_CREDIT_V2_15
  if (isEligibleCreditV2_16) return UserEligibilityType.ELIGIBLE_CREDIT_V2_16
  if (isEligibleCreditV2_17) return UserEligibilityType.ELIGIBLE_CREDIT_V2_17
  if (isEligibleCreditV2_18) return UserEligibilityType.ELIGIBLE_CREDIT_V2_18
  if (isEligibleCreditV3_15) return UserEligibilityType.ELIGIBLE_CREDIT_V3_15
  if (isEligibleCreditV3_16) return UserEligibilityType.ELIGIBLE_CREDIT_V3_16
  if (isEligibleCreditV3_17) return UserEligibilityType.ELIGIBLE_CREDIT_V3_17
  if (isEligibleCreditV3_18) return UserEligibilityType.ELIGIBLE_CREDIT_V3_18

  logUserEligibilityTypeFallback({ user })
  return UserEligibilityType.NOT_ELIGIBLE
}
