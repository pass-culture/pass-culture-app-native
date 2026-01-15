import { EligibilityType, UserRole } from 'api/gen/api'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

import { isUserFreeBeneficiaryOrEligible } from './isUserFreeBeneficiaryOrEligible'

describe('isUserFreeBeneficiaryOrEligible', () => {
  it.each`
    user                                                                                                                 | expected
    ${undefined}                                                                                                         | ${false}
    ${{ eligibility: EligibilityType.free } as UserProfileResponseWithoutSurvey}                                         | ${true}
    ${{ eligibility: EligibilityType.underage } as UserProfileResponseWithoutSurvey}                                     | ${false}
    ${{ roles: [UserRole.FREE_BENEFICIARY] } as UserProfileResponseWithoutSurvey}                                        | ${true}
    ${{ roles: [UserRole.BENEFICIARY] } as UserProfileResponseWithoutSurvey}                                             | ${false}
    ${{ eligibility: EligibilityType.free, roles: [] } as unknown as UserProfileResponseWithoutSurvey}                   | ${true}
    ${{ eligibility: EligibilityType.underage, roles: [UserRole.FREE_BENEFICIARY] } as UserProfileResponseWithoutSurvey} | ${true}
    ${{ eligibility: EligibilityType.underage, roles: undefined } as unknown as UserProfileResponseWithoutSurvey}        | ${false}
  `(
    'should return $expected for $user.eligibility user and $user.roles roles',
    ({ user, expected }: { user?: UserProfileResponseWithoutSurvey; expected: boolean }) => {
      expect(isUserFreeBeneficiaryOrEligible(user)).toEqual(expected)
    }
  )
})
