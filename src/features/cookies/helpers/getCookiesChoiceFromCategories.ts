import { Cookies, COOKIES_BY_CATEGORY, CookieCategoriesEnum } from 'features/cookies/CookiesPolicy'
import { CookiesChoiceByCategory } from 'features/cookies/helpers/useCookiesChoiceByCategory'

export const getCookiesChoiceFromCategories = (
  cookiesChoice: CookiesChoiceByCategory
): { accepted: Cookies; refused: Cookies } => {
  const acceptedCookies: Cookies = []
  const refusedCookies: Cookies = []

  Object.entries(cookiesChoice).forEach(([category, accepted]) => {
    if (accepted) {
      acceptedCookies.push(...COOKIES_BY_CATEGORY[category as CookieCategoriesEnum])
    } else {
      refusedCookies.push(...COOKIES_BY_CATEGORY[category as CookieCategoriesEnum])
    }
  })

  return { accepted: acceptedCookies, refused: refusedCookies }
}
