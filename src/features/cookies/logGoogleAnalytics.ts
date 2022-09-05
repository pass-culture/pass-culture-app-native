import { CookieNameEnum, Cookies } from 'features/cookies/CookiesPolicy'
import { analytics } from 'libs/firebase/analytics'

export const logGoogleAnalytics = (accepted: Cookies) => {
  const acceptedAnalytics = accepted.includes(CookieNameEnum.GOOGLE_ANALYTICS)
  acceptedAnalytics ? analytics.enableCollection() : analytics.disableCollection()
}
