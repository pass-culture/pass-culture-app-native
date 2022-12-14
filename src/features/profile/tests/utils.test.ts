import { UserProfileResponse } from 'api/gen'
import { isAppUrl } from 'features/navigation/helpers'
import { domains_credit_v1 } from 'features/profile/fixtures/domainsCredit'
import { getAvailableCredit } from 'features/user/helpers/useAvailableCredit'
import { beneficiaryUser, nonBeneficiaryUser, underageBeneficiaryUser } from 'fixtures/user'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { Info } from 'ui/svg/icons/Info'

import {
  computeCredit,
  matchSubscriptionMessageIconToSvg,
  isUserExBeneficiary,
  shouldOpenInbox,
} from '../utils'

jest.mock('react-native-email-link')
jest.mock('features/navigation/helpers')
jest.mock('features/user/helpers/useAvailableCredit')

describe('profile utils', () => {
  describe('Compute credit', () => {
    it('should compute credit', () => {
      expect(computeCredit(domains_credit_v1)).toEqual(40000)
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
    it("should return Clock if 'CLOCK' is passed", () => {
      const returnedIcon = matchSubscriptionMessageIconToSvg('CLOCK')
      expect(returnedIcon).toEqual(BicolorClock)
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
  describe('shouldOpenInbox', () => {
    it("should return true if url is appUrl and contains 'openInbox' string ", () => {
      const link = 'prefix' + 'openInbox'
      expect(shouldOpenInbox(link)).toBeTruthy()
    })
    it('should return false if url is appUrl and does not contain openInbox', () => {
      const link = 'prefix' + 'whatever'
      expect(shouldOpenInbox(link)).toBeFalsy()
    })
    it('should return false if url is not appUrl and contains openInbox', () => {
      const isAppUrlMock = isAppUrl as jest.Mock
      isAppUrlMock.mockReturnValueOnce(false)
      const link = 'https://whateveropenInbox.com'
      expect(shouldOpenInbox(link)).toBeFalsy()
    })
  })
})
