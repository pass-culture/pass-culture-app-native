import { UserProfileResponse } from 'api/gen'
import { Credit } from 'features/home/services/useAvailableCredit'
import { expiredCredit, nonExpiredCredit } from 'fixtures/credit'
import { beneficiaryUser, nonBeneficaryUser, underageBeneficiaryUser } from 'fixtures/user'
import { Clock } from 'ui/svg/icons/Clock'
import { Info } from 'ui/svg/icons/Info'

import { computeCredit, matchSubscriptionMessageIconToSvg, isUserExBeneficiary } from './utils'

const domainsCredit = {
  all: { initial: 50000, remaining: 40000 },
  physical: { initial: 30000, remaining: 10000 },
  digital: { initial: 30000, remaining: 20000 },
}

describe('profile utils', () => {
  describe('Compute credit', () => {
    it('should compute credit', () => {
      expect(computeCredit(domainsCredit)).toEqual(40000)
    })
    it('should compute credit equal to zero when no domainsCredit', () => {
      expect(computeCredit(null)).toEqual(0)
    })
  })
  describe('Match Icon string to SVG', () => {
    it('should return no icon if undefined is passed', () => {
      const returnedIcon = matchSubscriptionMessageIconToSvg(undefined)
      expect(returnedIcon).toEqual(undefined)
    })
    it('should return no icon if undefined is passed and fallback is true', () => {
      const returnedIcon = matchSubscriptionMessageIconToSvg(undefined, true)
      expect(returnedIcon).toEqual(undefined)
    })
    it("should return Clock if 'Clock' is passed", () => {
      const returnedIcon = matchSubscriptionMessageIconToSvg('Clock')
      expect(returnedIcon).toEqual(Clock)
    })
    it('should return Info if unknown string is passed and fallbackIcon is true', () => {
      const returnedIcon = matchSubscriptionMessageIconToSvg('I am an unknown string', true)
      expect(returnedIcon).toEqual(Info)
    })
    it('should return no icon if unknown string is passed and fallback is false', () => {
      const returnedIcon = matchSubscriptionMessageIconToSvg('I am an unknown string')
      expect(returnedIcon).toEqual(undefined)
    })
  })
  describe('Compute is user Ex-beneficiary', () => {
    it.each`
      user                       | credit              | expected
      ${nonBeneficaryUser}       | ${nonExpiredCredit} | ${false}
      ${nonBeneficaryUser}       | ${expiredCredit}    | ${false}
      ${beneficiaryUser}         | ${nonExpiredCredit} | ${false}
      ${beneficiaryUser}         | ${expiredCredit}    | ${true}
      ${underageBeneficiaryUser} | ${nonExpiredCredit} | ${false}
      ${underageBeneficiaryUser} | ${expiredCredit}    | ${true}
    `(
      'should return true only for beneficiary or underage beneficiary with expired credit',
      ({
        user,
        credit,
        expected,
      }: {
        user: UserProfileResponse
        credit: Credit
        expected: boolean
      }) => {
        expect(isUserExBeneficiary(user, credit)).toEqual(expected)
      }
    )
  })
})
