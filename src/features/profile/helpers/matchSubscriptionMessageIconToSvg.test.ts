import { CallToActionIcon, PopOverIcon } from 'api/gen'
import { Again } from 'ui/svg/icons/Again'
import { Clock } from 'ui/svg/icons/BicolorClock'
import { Warning } from 'ui/svg/icons/BicolorWarning'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Error as ErrorIcon } from 'ui/svg/icons/Error'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Info } from 'ui/svg/icons/Info'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'

import { matchSubscriptionMessageIconToSvg } from './matchSubscriptionMessageIconToSvg'

describe('matchSubscriptionMessageIconToSvg', () => {
  describe('PopOverIcon', () => {
    it("should return Clock icon if 'CLOCK' is passed", () => {
      const returnedIcon = matchSubscriptionMessageIconToSvg(PopOverIcon.CLOCK, Info)
      expect(returnedIcon).toEqual(Clock)
    })

    it("should return LegalNotices icon if 'FILE' is passed", () => {
      const returnedIcon = matchSubscriptionMessageIconToSvg(PopOverIcon.FILE, Info)
      expect(returnedIcon).toEqual(LegalNotices)
    })

    it("should return Error icon if 'ERROR' is passed", () => {
      const returnedIcon = matchSubscriptionMessageIconToSvg(PopOverIcon.ERROR, Info)
      expect(returnedIcon).toEqual(ErrorIcon)
    })

    it("should return Warning icon if 'WARNING' is passed", () => {
      const returnedIcon = matchSubscriptionMessageIconToSvg(PopOverIcon.WARNING, Info)
      expect(returnedIcon).toEqual(Warning)
    })

    it("should return Info icon if 'INFO' is passed", () => {
      const returnedIcon = matchSubscriptionMessageIconToSvg(PopOverIcon.INFO, Info)
      expect(returnedIcon).toEqual(Info)
    })
  })

  describe('CallToActionIcon', () => {
    it("should return EmailFiled icon if 'EMAIL' is passed", () => {
      const returnedIcon = matchSubscriptionMessageIconToSvg(CallToActionIcon.EMAIL, Info)
      expect(returnedIcon).toEqual(EmailFilled)
    })

    it("should return ExternalSiteFilled icon if 'EXTERNAL' is passed", () => {
      const returnedIcon = matchSubscriptionMessageIconToSvg(CallToActionIcon.EXTERNAL, Info)
      expect(returnedIcon).toEqual(ExternalSiteFilled)
    })

    it("should return Again icon if 'RETRY' is passed", () => {
      const returnedIcon = matchSubscriptionMessageIconToSvg(CallToActionIcon.RETRY, Info)
      expect(returnedIcon).toEqual(Again)
    })
  })

  it.each([undefined, null])('should give the fallback given no icon', (iconName) => {
    const returnedIcon = matchSubscriptionMessageIconToSvg(iconName, Info)
    expect(returnedIcon).toEqual(Info)
  })

  it('should no return icon when given no icon and no fallback icon', () => {
    const returnedIcon = matchSubscriptionMessageIconToSvg(undefined, undefined)
    expect(returnedIcon).toEqual(undefined)
  })
})
