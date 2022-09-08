import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { getCookiesChoiceFromCategories } from 'features/cookies/helpers/getCookiesChoiceFromCategories'

describe('getCookiesChoiceFromCategories', () => {
  it('should refuse all cookies if all categories are disabled', () => {
    const categoryChoice = {
      customization: false,
      performance: false,
      marketing: false,
    }

    const cookiesChoiceByCategory = getCookiesChoiceFromCategories(categoryChoice)

    expect(cookiesChoiceByCategory).toEqual({
      accepted: [],
      refused: ALL_OPTIONAL_COOKIES,
    })
  })

  it('should accept all cookies if all categories are enabled', () => {
    const categoryChoice = {
      customization: true,
      performance: true,
      marketing: true,
    }

    const cookiesChoiceByCategory = getCookiesChoiceFromCategories(categoryChoice)

    expect(cookiesChoiceByCategory).toEqual({
      accepted: ALL_OPTIONAL_COOKIES,
      refused: [],
    })
  })

  it('should accept or refuse certain cookies depending on category choice', () => {
    const categoryChoice = {
      customization: true,
      performance: true,
      marketing: false,
    }

    const cookiesChoiceByCategory = getCookiesChoiceFromCategories(categoryChoice)

    expect(cookiesChoiceByCategory).toEqual({
      accepted: [...COOKIES_BY_CATEGORY.customization, ...COOKIES_BY_CATEGORY.performance],
      refused: COOKIES_BY_CATEGORY.marketing,
    })
  })
})
