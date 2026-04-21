import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { nonBeneficiaryUserV2 } from 'fixtures/user'

import { getShouldDisplayActivationFlow } from './getShouldDisplayActivationFlow'

describe('getShouldDisplayActivationFlow', () => {
  describe('mapped eligibility rules', () => {
    it.each([
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_15, UserCreditType.CREDIT_UNKNOWN, true],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_15, UserCreditType.CREDIT_V2_15, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_16, UserCreditType.CREDIT_UNKNOWN, true],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_16, UserCreditType.CREDIT_V2_15, true],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_16, UserCreditType.CREDIT_V2_16, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_17, UserCreditType.CREDIT_V2_16, true],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_17, UserCreditType.CREDIT_V2_17, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_18, UserCreditType.CREDIT_V2_17, true],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_18, UserCreditType.CREDIT_V2_18, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V3_17, UserCreditType.CREDIT_V3_16, true],
      [UserEligibilityType.ELIGIBLE_CREDIT_V3_17, UserCreditType.CREDIT_V3_17, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V3_18, UserCreditType.CREDIT_V3_17, true],
      [UserEligibilityType.ELIGIBLE_CREDIT_V3_18, UserCreditType.CREDIT_V3_18, false],
    ])('for eligibility=%s and credit=%s returns %s', (eligibilityType, creditType, expected) => {
      expect(
        getShouldDisplayActivationFlow({
          ...nonBeneficiaryUserV2,
          eligibilityType,
          creditType,
          statusType: UserStatusType.UNKNOWN,
        })
      ).toBe(expected)
    })
  })

  describe('CREDIT_UNKNOWN', () => {
    it.each([
      UserEligibilityType.NOT_ELIGIBLE,
      UserEligibilityType.ELIGIBLE_BONUS,
      UserEligibilityType.ELIGIBLE_CREDIT_V1_18,
      UserEligibilityType.ELIGIBLE_CREDIT_V3_15,
      UserEligibilityType.ELIGIBLE_CREDIT_V3_16,
    ])('returns false when eligibility=%s when CREDIT_UNKNOWN', (eligibilityType) => {
      expect(
        getShouldDisplayActivationFlow({
          ...nonBeneficiaryUserV2,
          eligibilityType,
          creditType: UserCreditType.CREDIT_UNKNOWN,
          statusType: UserStatusType.ELIGIBLE,
        })
      ).toBe(false)
    })
  })

  describe('CREDIT_EMPTY', () => {
    it.each([
      [UserStatusType.ELIGIBLE, true],
      [UserStatusType.ELIGIBLE_AND_BENEFICIARY, true],
      [UserStatusType.BENEFICIARY, false],
      [UserStatusType.EX_BENEFICIARY, false],
      [UserStatusType.GENERAL_PUBLIC, false],
      [UserStatusType.SUSPENDED, false],
      [UserStatusType.UNKNOWN, false],
    ])('returns %s when CREDIT_EMPTY statusType=%s', (statusType, expected) => {
      expect(
        getShouldDisplayActivationFlow({
          ...nonBeneficiaryUserV2,
          eligibilityType: UserEligibilityType.NOT_ELIGIBLE,
          creditType: UserCreditType.CREDIT_EMPTY,
          statusType,
        })
      ).toBe(expected)
    })
  })
})
