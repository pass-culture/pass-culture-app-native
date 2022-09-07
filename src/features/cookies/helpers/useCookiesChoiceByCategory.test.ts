import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { useCookiesChoiceByCategory } from 'features/cookies/helpers/useCookiesChoiceByCategory'

describe('useCookiesChoiceByCategory', () => {
  it('should have every categories disabled when refusing all cookies', () => {
    const cookiesChoice = {
      refused: ALL_OPTIONAL_COOKIES,
      accepted: [],
    }

    const cookiesChoiceByCategory = useCookiesChoiceByCategory(cookiesChoice)

    expect(cookiesChoiceByCategory).toEqual({
      marketing: false,
      performance: false,
      customization: false,
    })
  })

  it('should have every categories enabled when accepting all cookies', () => {
    const cookiesChoice = {
      refused: [],
      accepted: ALL_OPTIONAL_COOKIES,
    }

    const cookiesChoiceByCategory = useCookiesChoiceByCategory(cookiesChoice)

    expect(cookiesChoiceByCategory).toEqual({
      marketing: true,
      performance: true,
      customization: true,
    })
  })

  it('Should have cookies choice by category to different choice when accepting and refusing different cookies', () => {
    const cookiesChoice = {
      refused: COOKIES_BY_CATEGORY.marketing,
      accepted: [...COOKIES_BY_CATEGORY.performance, ...COOKIES_BY_CATEGORY.customization],
    }

    const cookiesChoiceByCategory = useCookiesChoiceByCategory(cookiesChoice)

    expect(cookiesChoiceByCategory).toEqual({
      marketing: false,
      performance: true,
      customization: true,
    })
  })
})
