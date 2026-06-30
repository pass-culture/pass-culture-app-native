import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserProfile } from 'features/share/types'

import { isUserFreeBeneficiaryOrEligible } from './isUserFreeBeneficiaryOrEligible'

describe('isUserFreeBeneficiaryOrEligible', () => {
  it.each`
    user                                                                                                         | expected
    ${{}}                                                                                                        | ${false}
    ${undefined}                                                                                                 | ${false}
    ${{ eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_16 }}                                            | ${true}
    ${{ eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_15 }}                                            | ${true}
    ${{ eligibilityType: UserEligibilityType.NOT_ELIGIBLE }}                                                     | ${false}
    ${{ creditType: UserCreditType.CREDIT_V3_FREE }}                                                             | ${true}
    ${{ creditType: UserCreditType.CREDIT_V3_18 }}                                                               | ${false}
    ${{ eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_16, creditType: undefined }}                     | ${true}
    ${{ eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_15, creditType: UserCreditType.CREDIT_V3_FREE }} | ${true}
    ${{ eligibilityType: UserEligibilityType.NOT_ELIGIBLE, creditType: undefined }}                              | ${false}
    ${{ eligibilityType: undefined, creditType: UserCreditType.CREDIT_V3_FREE }}                                 | ${true}
    ${{ eligibilityType: undefined, creditType: UserCreditType.CREDIT_V3_18 }}                                   | ${false}
    ${{ eligibilityType: UserEligibilityType.NOT_ELIGIBLE, creditType: UserCreditType.CREDIT_V3_FREE }}          | ${true}
    ${{ eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_16, creditType: UserCreditType.CREDIT_V3_18 }}   | ${true}
    ${{ eligibilityType: null, creditType: UserCreditType.CREDIT_V3_FREE }}                                      | ${true}
    ${{ eligibilityType: null, creditType: undefined }}                                                          | ${false}
  `(
    'should return $expected for $user',
    ({ user, expected }: { user?: UserProfile; expected: boolean }) => {
      expect(isUserFreeBeneficiaryOrEligible(user)).toEqual(expected)
    }
  )
})
