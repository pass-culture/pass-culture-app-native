import { openInbox } from 'react-native-email-link'

import { UserProfileResponse } from 'api/gen'
import { getAvailableCredit } from 'features/home/services/useAvailableCredit'
import { openUrl, isAppUrl } from 'features/navigation/helpers'
import { beneficiaryUser, nonBeneficiaryUser, underageBeneficiaryUser } from 'fixtures/user'
import { Clock } from 'ui/svg/icons/Clock'
import { Info } from 'ui/svg/icons/Info'

import {
  computeCredit,
  matchSubscriptionMessageIconToSvg,
  isUserExBeneficiary,
  handleCallToActionLink,
} from './utils'

jest.mock('react-native-email-link')
jest.mock('features/navigation/helpers')
jest.mock('features/home/services/useAvailableCredit')

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
    it("should return Clock if 'CLOCK' is passed", () => {
      const returnedIcon = matchSubscriptionMessageIconToSvg('CLOCK')
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
  describe('handleCallToActionLink', () => {
    it("should call openInbox and not call openUrl if url is appUrl and contains 'openInbox' string ", () => {
      const link = 'prefix' + 'openInbox'
      handleCallToActionLink(link)
      expect(openInbox).toHaveBeenCalledWith()
      expect(openUrl).not.toHaveBeenCalled()
    })
    it('should not call openInbox and call openUrl if url is appUrl and does not contain openInbox', () => {
      const link = 'prefix' + 'whatever'
      handleCallToActionLink(link)
      expect(openInbox).not.toHaveBeenCalled()
      expect(openUrl).toHaveBeenCalledWith('prefixwhatever')
    })
    it('should call openUrl if url is not appUrl and contains openInbox', () => {
      const isAppUrlMock = isAppUrl as jest.Mock
      isAppUrlMock.mockReturnValueOnce(false)
      const link = 'https://whateveropenInbox.com'
      handleCallToActionLink(link)
      expect(openInbox).not.toHaveBeenCalled()
      expect(openUrl).toHaveBeenCalledWith('https://whateveropenInbox.com')
    })
  })
})
