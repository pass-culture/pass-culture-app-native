import { IdentityCheckMethod } from 'api/gen'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { beneficiaryUser } from 'fixtures/user'

import { shouldUseSimplifiedActivation18 } from './shouldUseSimplifiedActivation18'

const user = {
  ...beneficiaryUser,
  domainsCredit: { all: { initial: 5000, remaining: 5000 } },
}

describe('shouldUseSimplifiedActivation18', () => {
  it.each([IdentityCheckMethod.ubble, IdentityCheckMethod.dms, IdentityCheckMethod.educonnect])(
    'should accept a previously credited user identified with %s',
    (method) => {
      expect(
        shouldUseSimplifiedActivation18({
          enableSimplifiedActivation18: true,
          user,
          underageOkIdentityCheckMethod: method,
        })
      ).toBe(true)
    }
  )

  it('should preserve the standard journey when the flag is disabled', () => {
    expect(
      shouldUseSimplifiedActivation18({
        enableSimplifiedActivation18: false,
        user,
        underageOkIdentityCheckMethod: IdentityCheckMethod.ubble,
      })
    ).toBe(false)
  })

  it.each([undefined, null])('should reject a missing user: %s', (missingUser) => {
    expect(
      shouldUseSimplifiedActivation18({
        enableSimplifiedActivation18: true,
        user: missingUser,
        underageOkIdentityCheckMethod: IdentityCheckMethod.ubble,
      })
    ).toBe(false)
  })

  it.each([0, 5000])(
    'should check the initial credit, not the remaining balance: %s',
    (initial) => {
      expect(
        shouldUseSimplifiedActivation18({
          enableSimplifiedActivation18: true,
          user: { ...user, domainsCredit: { all: { initial, remaining: 0 } } },
          underageOkIdentityCheckMethod: IdentityCheckMethod.educonnect,
        })
      ).toBe(initial > 0)
    }
  )

  it('should reject users who are not eligible for the eighteen credit', () => {
    expect(
      shouldUseSimplifiedActivation18({
        enableSimplifiedActivation18: true,
        user: { ...user, eligibilityType: UserEligibilityType.NOT_ELIGIBLE },
        underageOkIdentityCheckMethod: IdentityCheckMethod.ubble,
      })
    ).toBe(false)
  })

  it.each([undefined, null])('should reject a missing historical identity method: %s', (method) => {
    expect(
      shouldUseSimplifiedActivation18({
        enableSimplifiedActivation18: true,
        user,
        underageOkIdentityCheckMethod: method,
      })
    ).toBe(false)
  })
})
