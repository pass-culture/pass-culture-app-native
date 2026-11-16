import { SubscriptionStatus } from 'api/gen'
import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { beneficiaryUser } from 'fixtures/user'

import { hasCompletedCreditActivation } from './hasCompletedCreditActivation'

describe('hasCompletedCreditActivation', () => {
  const activeUser = { ...beneficiaryUser, depositExpirationDate: '2099-01-01T00:00:00Z' }

  it('should return true when user has ongoing credit', () => {
    expect(hasCompletedCreditActivation(activeUser)).toBe(true)
  })

  it.each(Object.values(SubscriptionStatus))(
    'should return false when subscription is %s',
    (subscriptionStatus) => {
      expect(hasCompletedCreditActivation({ ...activeUser, subscriptionStatus })).toBe(false)
    }
  )

  it('return false when the eighteen upgrade remains to be done', () => {
    expect(
      hasCompletedCreditActivation({
        ...activeUser,
        creditType: UserCreditType.CREDIT_V3_17,
        eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_18,
      })
    ).toBe(false)
  })

  it('should return true when expired credits', () => {
    expect(
      hasCompletedCreditActivation({ ...activeUser, depositExpirationDate: '2000-01-01' })
    ).toBe(false)
  })
})
