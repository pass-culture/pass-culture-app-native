import { EligibilityType } from 'api/gen'
import { getHeaderSubtitleProps } from 'features/profile/helpers/getHeaderSubtitleProps'

describe('getHeaderSubtitleProps', () => {
  it.each`
    isCreditEmpty | isDepositExpired | depositExpirationDate    | eligibility                  | expectedStartSubtitle               | expectedEndSubtitle
    ${true}       | ${false}         | ${'2024-10-06T12:10:05'} | ${EligibilityType['age-18']} | ${'Tu as dépensé tout ton crédit'}  | ${undefined}
    ${true}       | ${false}         | ${'2024-10-06T12:10:05'} | ${EligibilityType.free}      | ${''}                               | ${undefined}
    ${false}      | ${true}          | ${'2023-10-06T12:10:05'} | ${EligibilityType['age-18']} | ${'Ton crédit a expiré le'}         | ${'05/10/2023'}
    ${false}      | ${false}         | ${'2024-10-06T12:10:05'} | ${EligibilityType['age-18']} | ${'Profite de ton crédit jusqu’au'} | ${'05/10/2024'}
  `(
    'should return expected subtitle when isCreditEmpty=$isCreditEmpty isDepositExpired=$isDepositExpired and expirationDate=$depositExpirationDate',
    ({ expectedStartSubtitle, expectedEndSubtitle, ...props }) => {
      const { startSubtitle, boldEndSubtitle } = getHeaderSubtitleProps(props)

      expect(startSubtitle).toEqual(expectedStartSubtitle)
      expect(boldEndSubtitle).toEqual(expectedEndSubtitle)
    }
  )
})
