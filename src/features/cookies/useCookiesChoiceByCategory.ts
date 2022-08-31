import {
  Consent,
  CookieCategoriesEnum,
  COOKIES_BY_CATEGORY,
  Cookies,
} from 'features/cookies/CookiesPolicy'

type CookiesChoice = Omit<Consent, 'mandatory'>

export type CookiesChoiceByCategory = {
  [CookieCategoriesEnum.marketing]: boolean
  [CookieCategoriesEnum.performance]: boolean
  [CookieCategoriesEnum.customization]: boolean
}

export const useCookiesChoiceByCategory = (
  cookiesChoice?: CookiesChoice
): CookiesChoiceByCategory => {
  if (!cookiesChoice)
    return {
      marketing: false,
      performance: false,
      customization: false,
    }
  const hasAcceptedCookies = (cookiesByCategory: Cookies) =>
    Object.values(cookiesByCategory).every((cookie) => cookiesChoice.accepted.includes(cookie))
  return {
    marketing: hasAcceptedCookies(COOKIES_BY_CATEGORY.marketing),
    performance: hasAcceptedCookies(COOKIES_BY_CATEGORY.performance),
    customization: hasAcceptedCookies(COOKIES_BY_CATEGORY.customization),
  }
}
