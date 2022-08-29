import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { useCookiesChoiceByCategory } from 'features/cookies/useCookiesChoiceByCategory'

describe('useCookiesChoiceByCategory', () => {
  it('should past all cookies choice by category to false when refused all', () => {
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

  it('should past all cookies choice by category to true when accepted all', () => {
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

  it('Should past cookies choice by category to different choice when accept and refuse some cookies', () => {
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
