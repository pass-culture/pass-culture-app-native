import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { ConsentState } from 'features/cookies/enums'
import { getCookiesChoiceByCategory } from 'features/cookies/helpers/getCookiesChoiceByCategory'
import { ConsentStatus } from 'features/cookies/types'

describe('getCookiesChoiceByCategory', () => {
  it('should have every categories disabled when constent status is loading', () => {
    const cookiesChoice: ConsentStatus = {
      state: ConsentState.LOADING,
    }

    const cookiesChoiceByCategory = getCookiesChoiceByCategory(cookiesChoice)

    expect(cookiesChoiceByCategory).toEqual({
      marketing: false,
      performance: false,
      customization: false,
    })
  })

  it('should have every categories disabled when constent status is unknown', () => {
    const cookiesChoice: ConsentStatus = {
      state: ConsentState.UNKNOWN,
    }

    const cookiesChoiceByCategory = getCookiesChoiceByCategory(cookiesChoice)

    expect(cookiesChoiceByCategory).toEqual({
      marketing: false,
      performance: false,
      customization: false,
    })
  })

  it('should have every categories disabled when refusing all cookies', () => {
    const cookiesChoice: ConsentStatus = {
      state: ConsentState.HAS_CONSENT,
      value: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        refused: ALL_OPTIONAL_COOKIES,
        accepted: [],
      },
    }

    const cookiesChoiceByCategory = getCookiesChoiceByCategory(cookiesChoice)

    expect(cookiesChoiceByCategory).toEqual({
      marketing: false,
      performance: false,
      customization: false,
    })
  })

  it('should have every categories enabled when accepting all cookies', () => {
    const cookiesChoice: ConsentStatus = {
      state: ConsentState.HAS_CONSENT,
      value: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        refused: [],
        accepted: ALL_OPTIONAL_COOKIES,
      },
    }

    const cookiesChoiceByCategory = getCookiesChoiceByCategory(cookiesChoice)

    expect(cookiesChoiceByCategory).toEqual({
      marketing: true,
      performance: true,
      customization: true,
    })
  })

  it('Should have cookies choice by category to different choice when accepting and refusing different cookies', () => {
    const cookiesChoice: ConsentStatus = {
      state: ConsentState.HAS_CONSENT,
      value: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        refused: COOKIES_BY_CATEGORY.marketing,
        accepted: [...COOKIES_BY_CATEGORY.performance, ...COOKIES_BY_CATEGORY.customization],
      },
    }

    const cookiesChoiceByCategory = getCookiesChoiceByCategory(cookiesChoice)

    expect(cookiesChoiceByCategory).toEqual({
      marketing: false,
      performance: true,
      customization: true,
    })
  })
})
