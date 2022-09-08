import { CookieCategoriesEnum, CookieNameEnum } from 'features/cookies/enums'
import { Cookies } from 'features/cookies/types'

export const COOKIES_BY_CATEGORY: Record<CookieCategoriesEnum, Cookies> = {
  [CookieCategoriesEnum.customization]: [
    CookieNameEnum.BATCH,
    CookieNameEnum.CAMPAIGN_DATE,
    CookieNameEnum.TRAFFIC_CAMPAIGN,
    CookieNameEnum.TRAFFIC_MEDIUM,
    CookieNameEnum.TRAFFIC_SOURCE,
  ],
  [CookieCategoriesEnum.performance]: [
    CookieNameEnum.ALGOLIA_INSIGHTS,
    CookieNameEnum.AMPLITUDE,
    CookieNameEnum.GOOGLE_ANALYTICS,
  ],
  [CookieCategoriesEnum.essential]: [
    CookieNameEnum.ACCESS_TOKEN,
    CookieNameEnum.APP_TRACKING_TRANSPARENCY,
    CookieNameEnum.EDU_CONNECT,
    CookieNameEnum.FIRST_TIME_REVIEW_HAS_BEEN_REQUESTED,
    CookieNameEnum.HAS_SEEN_ELIGIBLE_CARD,
    CookieNameEnum.HAS_SEEN_TUTORIALS,
    CookieNameEnum.HAS_SEEN_BIRTHDAY_NOTIFICATION_CARD,
    CookieNameEnum.KEYCHAIN,
    CookieNameEnum.PHONE_VALIDATION_CODE_ASKED_AT,
    CookieNameEnum.RE_CAPTCHA,
    CookieNameEnum.REACT_NAVIGATION_PERSISTENCE,
    CookieNameEnum.SENTRY,
    CookieNameEnum.TIMES_REVIEW_HAS_BEEN_REQUESTED,
    CookieNameEnum.UBBLE,
  ],
  [CookieCategoriesEnum.marketing]: [CookieNameEnum.APPSFLYER],
}

export const ALL_OPTIONAL_COOKIES = [
  ...COOKIES_BY_CATEGORY.customization,
  ...COOKIES_BY_CATEGORY.performance,
  ...COOKIES_BY_CATEGORY.marketing,
]
