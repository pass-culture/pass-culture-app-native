import {
  CookieCategories,
  CookieCategoriesEnum,
  COOKIES_BY_CATEGORY,
  Cookies,
} from 'features/cookies/CookiesPolicy'

type CookiesChoice = Omit<CookieCategories, 'mandatory'>

export type CookiesChoiceByCategory = {
  [CookieCategoriesEnum.marketing]: boolean
  [CookieCategoriesEnum.performance]: boolean
  [CookieCategoriesEnum.customization]: boolean
}

export const useCookiesChoiceByCategory = (
  cookiesChoice: CookiesChoice
): CookiesChoiceByCategory => {
  if (cookiesChoice.accepted.length !== 0 && cookiesChoice.refused.length !== 0) {
    const hasAcceptedCookies = (cookiesByCategory: Cookies) =>
      Object.values(cookiesByCategory).every((cookie) => cookiesChoice.accepted.includes(cookie))
    return {
      marketing: hasAcceptedCookies(COOKIES_BY_CATEGORY.marketing),
      performance: hasAcceptedCookies(COOKIES_BY_CATEGORY.performance),
      customization: hasAcceptedCookies(COOKIES_BY_CATEGORY.customization),
    }
  }
  if (cookiesChoice.accepted.length !== 0) {
    return {
      marketing: true,
      performance: true,
      customization: true,
    }
  }
  return {
    marketing: false,
    performance: false,
    customization: false,
  }
}
