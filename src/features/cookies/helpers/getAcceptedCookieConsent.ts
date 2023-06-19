import { CookieNameEnum } from 'features/cookies/enums'
import { getCookiesChoice as getCookiesConsentV2 } from 'features/cookies/helpers/useCookies'

export const getAcceptedCookieConsent = async (cookie: CookieNameEnum): Promise<boolean | null> => {
  const cookiesChoiceV2 = await getCookiesConsentV2()
  return cookiesChoiceV2?.consent?.accepted?.includes(cookie) ?? false
}
