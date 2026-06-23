import { DepositType, UserProfileResponse } from 'api/gen'
import { getIsDepositExpired } from 'features/profile/helpers/getIsDepositExpired'
import { logUserCreditTypeFallback } from 'features/profile/helpers/logUserCreditTypeFallback'
import { getAge } from 'shared/user/getAge'

export enum UserCreditType {
  CREDIT_UNKNOWN = 'CREDIT_UNKNOWN',
  CREDIT_EMPTY = 'CREDIT_EMPTY',
  CREDIT_EXPIRED = 'CREDIT_EXPIRED',
  CREDIT_V1_18 = 'CREDIT_V1_18',
  CREDIT_V2_15 = 'CREDIT_V2_15',
  CREDIT_V2_16 = 'CREDIT_V2_16',
  CREDIT_V2_17 = 'CREDIT_V2_17',
  CREDIT_V2_18 = 'CREDIT_V2_18',
  CREDIT_V3_FREE = 'CREDIT_V3_FREE',
  CREDIT_V3_17 = 'CREDIT_V3_17',
  CREDIT_V3_18 = 'CREDIT_V3_18',
  CREDIT_BONUS = 'CREDIT_BONUS',
  NO_CREDIT = 'NO_CREDIT',
}

export const getCreditType = (user: UserProfileResponse): UserCreditType => {
  const {
    depositType,
    domainsCredit,
    birthDate,
    depositExpirationDate,
    isEligibleForBeneficiaryUpgrade,
  } = user

  const age = getAge(birthDate)
  const isFifteen = age === 15
  const isSixteen = age === 16
  const isSeventeen = age === 17
  const isEighteenToTwenty = age && age >= 18 && age <= 20

  const isCreditV2Underage = depositType === DepositType.GRANT_15_17
  const isCreditV2UnderageExpiredByAge = isCreditV2Underage && isEighteenToTwenty
  const isDepositExpired = getIsDepositExpired({ depositExpirationDate })
  const isNotEligibleForBeneficiaryUpgrade = !isEligibleForBeneficiaryUpgrade
  const actualyNotPossibleInFrontend = false

  // CREDIT_V1
  const isCreditV1_18 = actualyNotPossibleInFrontend

  // CREDIT_V2
  const isCreditV2_15 = isCreditV2Underage && isFifteen
  const isCreditV2_16 = isCreditV2Underage && isSixteen
  const isCreditV2_17 = isCreditV2Underage && isSeventeen
  const isCreditV2_18 = depositType === DepositType.GRANT_18

  // CREDIT_V3
  const isCreditV3_free = depositType === DepositType.GRANT_FREE
  const isCreditV3 = depositType === DepositType.GRANT_17_18
  const isEighteenToTwentyEligibleForUpgrade = isEighteenToTwenty && isEligibleForBeneficiaryUpgrade
  const isCreditV3_17 = isCreditV3 && (isSeventeen || isEighteenToTwentyEligibleForUpgrade)
  const isCreditV3_18 = isCreditV3 && isNotEligibleForBeneficiaryUpgrade && isEighteenToTwenty

  //OTHER CREDIT TYPES
  const isEmptyCredit = domainsCredit?.all?.remaining === 0 && !isCreditV3_free
  const isCreditExpired = isDepositExpired || isCreditV2UnderageExpiredByAge
  const isCreditBonus = actualyNotPossibleInFrontend
  const isNoCredit = !depositType

  if (isCreditExpired) return UserCreditType.CREDIT_EXPIRED
  if (isEmptyCredit) return UserCreditType.CREDIT_EMPTY
  if (isCreditV1_18) return UserCreditType.CREDIT_V1_18
  if (isCreditV2_15) return UserCreditType.CREDIT_V2_15
  if (isCreditV2_16) return UserCreditType.CREDIT_V2_16
  if (isCreditV2_17) return UserCreditType.CREDIT_V2_17
  if (isCreditV2_18) return UserCreditType.CREDIT_V2_18
  if (isCreditV3_free) return UserCreditType.CREDIT_V3_FREE
  if (isCreditV3_17) return UserCreditType.CREDIT_V3_17
  if (isCreditV3_18) return UserCreditType.CREDIT_V3_18
  if (isCreditBonus) return UserCreditType.CREDIT_BONUS
  if (isNoCredit) return UserCreditType.NO_CREDIT

  logUserCreditTypeFallback({ user })
  return UserCreditType.CREDIT_UNKNOWN
}
