export enum CookieNameEnum {
  GOOGLE_ANALYTICS,
  AMPLITUDE,
  ALGOLIA,
  RE_CAPTCHA,
  UBBLE,
  EDU_CONNECT,
  KEYCHAIN,
  SENTRY,
  APP_TRACKING_TRANSPARENCY,
  ACCESS_TOKEN,
  FIRST_TIME_REVIEW_HAS_BEEN_REQUESTED,
  HAS_SEEN_ELIGIBLE_CARD,
  HAS_SEEN_TUTORIALS,
  PHONE_VALIDATION_CODE_ASKED_AT,
  REACT_NAVIGATION_PERSISTENCE,
  TIMES_REVIEW_HAS_BEEN_REQUESTED,
  HAS_SEEN_BIRTHDAY_NOTIFICATION_CARD,
  BATCH,
  CAMPAIGN_DATE,
  TRAFFIC_CAMPAIGN,
  TRAFFIC_MEDIUM,
  TRAFFIC_SOURCE,
  APPSFLYER,
}

export type Cookies = CookieNameEnum[]

export interface Consent {
  mandatory: Cookies
  accepted: Cookies
  refused: Cookies
}

export interface CookiesConsent {
  consent?: Consent
  deviceId?: string
  choiceDatetime?: Date
}

export enum CookieCategoriesEnum {
  customization = 'customization',
  performance = 'performance',
  marketing = 'marketing',
  essential = 'essential',
}

export const COOKIES_BY_CATEGORY: Record<CookieCategoriesEnum, Cookies> = {
  [CookieCategoriesEnum.customization]: [
    CookieNameEnum.BATCH,
    CookieNameEnum.CAMPAIGN_DATE,
    CookieNameEnum.TRAFFIC_CAMPAIGN,
    CookieNameEnum.TRAFFIC_MEDIUM,
    CookieNameEnum.TRAFFIC_SOURCE,
  ],
  [CookieCategoriesEnum.performance]: [
    CookieNameEnum.GOOGLE_ANALYTICS,
    CookieNameEnum.AMPLITUDE,
    CookieNameEnum.ALGOLIA,
  ],
  [CookieCategoriesEnum.essential]: [
    CookieNameEnum.RE_CAPTCHA,
    CookieNameEnum.UBBLE,
    CookieNameEnum.EDU_CONNECT,
    CookieNameEnum.KEYCHAIN,
    CookieNameEnum.SENTRY,
    CookieNameEnum.APP_TRACKING_TRANSPARENCY,
    CookieNameEnum.ACCESS_TOKEN,
    CookieNameEnum.FIRST_TIME_REVIEW_HAS_BEEN_REQUESTED,
    CookieNameEnum.HAS_SEEN_ELIGIBLE_CARD,
    CookieNameEnum.HAS_SEEN_TUTORIALS,
    CookieNameEnum.PHONE_VALIDATION_CODE_ASKED_AT,
    CookieNameEnum.REACT_NAVIGATION_PERSISTENCE,
    CookieNameEnum.TIMES_REVIEW_HAS_BEEN_REQUESTED,
    CookieNameEnum.HAS_SEEN_BIRTHDAY_NOTIFICATION_CARD,
  ],
  [CookieCategoriesEnum.marketing]: [CookieNameEnum.APPSFLYER],
}

export const ALL_OPTIONAL_COOKIES = [
  ...COOKIES_BY_CATEGORY.customization,
  ...COOKIES_BY_CATEGORY.performance,
  ...COOKIES_BY_CATEGORY.marketing,
]
