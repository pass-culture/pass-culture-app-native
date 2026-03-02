import { DepositType, UserProfileResponse } from 'api/gen'
import { getIsDepositExpired } from 'features/profile/helpers/getIsDepositExpired'
import { getAge } from 'shared/user/getAge'

export enum UserCreditType {
  NO_CREDIT = 'NO_CREDIT',
  CREDIT_EXPIRED = 'CREDIT_EXPIRED',
  CREDIT_V1_18 = 'CREDIT_V1_18',
  CREDIT_V2_15 = 'CREDIT_V2_15',
  CREDIT_V2_16 = 'CREDIT_V2_16',
  CREDIT_V2_17 = 'CREDIT_V2_17',
  CREDIT_V2_18 = 'CREDIT_V2_18',
  CREDIT_V3_15 = 'CREDIT_V3_15',
  CREDIT_V3_16 = 'CREDIT_V3_16',
  CREDIT_V3_17 = 'CREDIT_V3_17',
  CREDIT_V3_18 = 'CREDIT_V3_18',
  CREDIT_BONUS = 'CREDIT_BONUS',
}

export const getCreditType = ({
  depositType,
  birthDate,
  depositExpirationDate,
  isEligibleForBeneficiaryUpgrade,
}: UserProfileResponse): UserCreditType => {
  const isCreditExpired = getIsDepositExpired({ depositExpirationDate })
  const isNotEligibleForBeneficiaryUpgrade = !isEligibleForBeneficiaryUpgrade
  const actualyNotPossibleInFrontend = false

  const age = getAge(birthDate)
  const isFifteen = age === 15
  const isSixteen = age === 16
  const isSeventeen = age === 17
  const isEighteenOrMore = age && age >= 18

  // CREDIT_V1
  const isCreditV1_18 = actualyNotPossibleInFrontend

  // CREDIT_V2
  const isCreditV2_15 = depositType === DepositType.GRANT_15_17 && isFifteen
  const isCreditV2_16 = depositType === DepositType.GRANT_15_17 && isSixteen
  const isCreditV2_17 = depositType === DepositType.GRANT_15_17 && isSeventeen
  const isCreditV2_18 = depositType === DepositType.GRANT_18

  // CREDIT_V3
  const isCreditV3_free = depositType === DepositType.GRANT_FREE
  const isCreditV3 = depositType === DepositType.GRANT_17_18
  const isEighteenOrMoreAndEligibleForUpgrade = isEighteenOrMore && isEligibleForBeneficiaryUpgrade
  const isCreditV3_15 = isCreditV3_free && isFifteen
  const isCreditV3_16 = isCreditV3_free && isSixteen
  const isCreditV3_17 = isCreditV3 && (isSeventeen || isEighteenOrMoreAndEligibleForUpgrade)
  const isCreditV3_18 = isCreditV3 && isNotEligibleForBeneficiaryUpgrade && isEighteenOrMore
  const isCreditBonus = actualyNotPossibleInFrontend

  if (isCreditExpired) return UserCreditType.CREDIT_EXPIRED
  if (isCreditV1_18) return UserCreditType.CREDIT_V1_18
  if (isCreditV2_15) return UserCreditType.CREDIT_V2_15
  if (isCreditV2_16) return UserCreditType.CREDIT_V2_16
  if (isCreditV2_17) return UserCreditType.CREDIT_V2_17
  if (isCreditV2_18) return UserCreditType.CREDIT_V2_18
  if (isCreditV3_15) return UserCreditType.CREDIT_V3_15
  if (isCreditV3_16) return UserCreditType.CREDIT_V3_16
  if (isCreditV3_17) return UserCreditType.CREDIT_V3_17
  if (isCreditV3_18) return UserCreditType.CREDIT_V3_18
  if (isCreditBonus) return UserCreditType.CREDIT_BONUS
  return UserCreditType.NO_CREDIT
}
