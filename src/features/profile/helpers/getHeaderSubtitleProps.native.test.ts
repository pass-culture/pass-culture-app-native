import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { getHeaderSubtitleProps } from 'features/profile/helpers/getHeaderSubtitleProps'

describe('getHeaderSubtitleProps', () => {
  it.each`
    isCreditEmpty | isDepositExpired | depositExpirationDate    | eligibility                                  | statusType                       | expectedStartSubtitle               | expectedEndSubtitle
    ${true}       | ${false}         | ${'2024-10-06T12:10:05'} | ${UserEligibilityType.ELIGIBLE_CREDIT_V2_18} | ${UserStatusType.BENEFICIARY}    | ${'Tu as dépensé tout ton crédit'}  | ${undefined}
    ${true}       | ${false}         | ${'2023-10-06T12:10:05'} | ${UserEligibilityType.NOT_ELIGIBLE}          | ${UserStatusType.EX_BENEFICIARY} | ${'Ton crédit est expiré'}          | ${undefined}
    ${false}      | ${false}         | ${undefined}             | ${UserEligibilityType.ELIGIBLE_CREDIT_V3_15} | ${UserStatusType.ELIGIBLE}       | ${undefined}                        | ${undefined}
    ${false}      | ${true}          | ${'2023-10-06T12:10:05'} | ${UserEligibilityType.ELIGIBLE_CREDIT_V2_18} | ${UserStatusType.BENEFICIARY}    | ${'Ton crédit a expiré le'}         | ${'05/10/2023'}
    ${false}      | ${false}         | ${'2024-10-06T12:10:05'} | ${UserEligibilityType.ELIGIBLE_CREDIT_V2_18} | ${UserStatusType.BENEFICIARY}    | ${'Profite de ton crédit jusqu’au'} | ${'05/10/2024'}
    ${false}      | ${false}         | ${undefined}             | ${UserEligibilityType.ELIGIBLE_CREDIT_V2_18} | ${UserStatusType.BENEFICIARY}    | ${undefined}                        | ${undefined}
    ${false}      | ${false}         | ${null}                  | ${UserEligibilityType.ELIGIBLE_CREDIT_V2_18} | ${UserStatusType.BENEFICIARY}    | ${undefined}                        | ${undefined}
    ${true}       | ${true}          | ${'2024-10-06T12:10:05'} | ${UserEligibilityType.ELIGIBLE_CREDIT_V2_18} | ${UserStatusType.BENEFICIARY}    | ${'Tu as dépensé tout ton crédit'}  | ${undefined}
    ${false}      | ${false}         | ${undefined}             | ${UserEligibilityType.ELIGIBLE_CREDIT_V3_15} | ${UserStatusType.ELIGIBLE}       | ${undefined}                        | ${undefined}
  `(
    'should return correct subtitles when isCreditEmpty=$isCreditEmpty isDepositExpired=$isDepositExpired statusType=$statusTypedepositExpirationDate=$depositExpirationDate eligibility=$eligibility',
    ({ expectedStartSubtitle, expectedEndSubtitle, ...props }) => {
      const { startSubtitle, boldEndSubtitle } = getHeaderSubtitleProps(props)

      expect(startSubtitle).toEqual(expectedStartSubtitle)
      expect(boldEndSubtitle).toEqual(expectedEndSubtitle)
    }
  )
})
