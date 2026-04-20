import { UserRole } from 'api/gen'
import { UserProfile } from 'features/share/types'
import { beneficiaryUserV2, eligibleUserV2, nonBeneficiaryUserV2 } from 'fixtures/user'
import { getAvailableCredit } from 'shared/user/useAvailableCredit'

import { isUserExBeneficiary } from './isUserExBeneficiary'

jest.mock('shared/user/useAvailableCredit')

const underageBeneficiaryUser: UserProfile = {
  ...eligibleUserV2,
  roles: [UserRole.UNDERAGE_BENEFICIARY],
}

describe('isUserExBeneficiary', () => {
  it.each`
    user                       | isCreditExpired | expected
    ${nonBeneficiaryUserV2}    | ${false}        | ${false}
    ${nonBeneficiaryUserV2}    | ${true}         | ${false}
    ${beneficiaryUserV2}       | ${false}        | ${false}
    ${beneficiaryUserV2}       | ${true}         | ${true}
    ${underageBeneficiaryUser} | ${false}        | ${false}
    ${underageBeneficiaryUser} | ${true}         | ${true}
  `(
    'should return true only for beneficiary or underage beneficiary with expired credit',
    ({
      user,
      isCreditExpired,
      expected,
    }: {
      user: UserProfile
      isCreditExpired: boolean
      expected: boolean
    }) => {
      const getAvailableCreditMock = getAvailableCredit as jest.Mock
      getAvailableCreditMock.mockImplementationOnce(() => ({
        amount: 10,
        isExpired: isCreditExpired,
      }))

      expect(isUserExBeneficiary(user)).toEqual(expected)
    }
  )
})
