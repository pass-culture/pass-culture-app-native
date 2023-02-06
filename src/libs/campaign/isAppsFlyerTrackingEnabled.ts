import { CookieNameEnum } from 'features/cookies/enums'
import { getCookiesChoice } from 'features/cookies/helpers/useCookies'

export const isAppsFlyerTrackingEnabled = async () => {
  const cookiesChoice = await getCookiesChoice()
  const acceptedCookies = cookiesChoice?.consent?.accepted ?? []

  return acceptedCookies.includes(CookieNameEnum.APPSFLYER)
}
