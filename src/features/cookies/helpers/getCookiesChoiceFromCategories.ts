import { COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { CookieCategoriesEnum } from 'features/cookies/enums'
import { Cookies, CookiesChoiceByCategory } from 'features/cookies/types'

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
