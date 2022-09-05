import { CookieNameEnum } from 'features/cookies/CookiesPolicy'
import { getCookiesChoice as getCookiesConsentV2 } from 'features/cookies/useCookies'

export const getAcceptedCookieConsent = async (cookie: CookieNameEnum): Promise<boolean | null> => {
  const cookiesChoiceV2 = await getCookiesConsentV2()
  if (!cookiesChoiceV2) return false
  return cookiesChoiceV2.consent.accepted.includes(cookie)
}
