import { COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { Consent, Cookies, CookiesChoiceByCategory } from 'features/cookies/types'

type CookiesChoice = Omit<Consent, 'mandatory'>

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
