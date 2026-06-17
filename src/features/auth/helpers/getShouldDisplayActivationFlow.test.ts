import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { nonBeneficiaryUserV2 } from 'fixtures/user'

import { getShouldDisplayActivationFlow } from './getShouldDisplayActivationFlow'

describe('getShouldDisplayActivationFlow', () => {
  describe('mapped eligibility rules', () => {
    it.each([
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_15, UserCreditType.CREDIT_V2_15, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_16, UserCreditType.CREDIT_V2_15, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_16, UserCreditType.CREDIT_V2_16, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_17, UserCreditType.CREDIT_V2_15, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_17, UserCreditType.CREDIT_V2_16, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_17, UserCreditType.CREDIT_V2_17, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_18, UserCreditType.CREDIT_V2_15, true],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_18, UserCreditType.CREDIT_V2_16, true],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_18, UserCreditType.CREDIT_V2_17, true],
      [UserEligibilityType.ELIGIBLE_CREDIT_V2_18, UserCreditType.CREDIT_V2_18, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V3_16, UserCreditType.CREDIT_V3_FREE, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V3_17, UserCreditType.CREDIT_V3_FREE, true],
      [UserEligibilityType.ELIGIBLE_CREDIT_V3_17, UserCreditType.CREDIT_V2_15, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V3_17, UserCreditType.CREDIT_V2_16, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V3_17, UserCreditType.CREDIT_V2_17, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V3_17, UserCreditType.CREDIT_V3_FREE, true],
      [UserEligibilityType.ELIGIBLE_CREDIT_V3_17, UserCreditType.CREDIT_V3_17, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V3_18, UserCreditType.CREDIT_V2_15, true],
      [UserEligibilityType.ELIGIBLE_CREDIT_V3_18, UserCreditType.CREDIT_V2_16, true],
      [UserEligibilityType.ELIGIBLE_CREDIT_V3_18, UserCreditType.CREDIT_V2_17, true],
      [UserEligibilityType.ELIGIBLE_CREDIT_V3_18, UserCreditType.CREDIT_V2_18, false],
      [UserEligibilityType.ELIGIBLE_CREDIT_V3_18, UserCreditType.CREDIT_V3_FREE, true],
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
})
