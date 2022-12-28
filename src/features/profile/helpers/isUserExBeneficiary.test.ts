import { UserProfileResponse } from 'api/gen'
import { getAvailableCredit } from 'features/user/helpers/useAvailableCredit'
import { beneficiaryUser, nonBeneficiaryUser, underageBeneficiaryUser } from 'fixtures/user'

import { isUserExBeneficiary } from './isUserExBeneficiary'

jest.mock('features/user/helpers/useAvailableCredit')

describe('isUserExBeneficiary', () => {
  it.each`
    user                       | isCreditExpired | expected
    ${nonBeneficiaryUser}      | ${false}        | ${false}
    ${nonBeneficiaryUser}      | ${true}         | ${false}
    ${beneficiaryUser}         | ${false}        | ${false}
    ${beneficiaryUser}         | ${true}         | ${true}
    ${underageBeneficiaryUser} | ${false}        | ${false}
    ${underageBeneficiaryUser} | ${true}         | ${true}
  `(
    'should return true only for beneficiary or underage beneficiary with expired credit',
    ({
      user,
      isCreditExpired,
      expected,
    }: {
      user: UserProfileResponse
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
