import { COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { ConsentState } from 'features/cookies/enums'
import { Cookies, CookiesChoiceByCategory, ConsentStatus } from 'features/cookies/types'

export const useCookiesChoiceByCategory = (
  cookiesChoice: ConsentStatus
): CookiesChoiceByCategory => {
  if (
    cookiesChoice.state === ConsentState.LOADING ||
    cookiesChoice.state === ConsentState.UNKNOWN
  ) {
    return {
      marketing: false,
      performance: false,
      customization: false,
    }
  }

  const hasAcceptedCookies = (cookiesByCategory: Cookies) =>
    Object.values(cookiesByCategory).every((cookie) =>
      cookiesChoice.value?.accepted.includes(cookie)
    )
  return {
    marketing: hasAcceptedCookies(COOKIES_BY_CATEGORY.marketing),
    performance: hasAcceptedCookies(COOKIES_BY_CATEGORY.performance),
    customization: hasAcceptedCookies(COOKIES_BY_CATEGORY.customization),
  }
}
