export enum CookieNameEnum {
  ACCESS_TOKEN = 'access_token',
  ALGOLIA_INSIGHTS = 'algolia_insights',
  AMPLITUDE = 'amplitude',
  APP_TRACKING_TRANSPARENCY = 'app_tracking_transparency',
  APPSFLYER = 'appsflyer',
  BATCH = 'batch',
  CAMPAIGN_DATE = 'campaign_date',
  EDU_CONNECT = 'edu_connect',
  FIRST_TIME_REVIEW_HAS_BEEN_REQUESTED = 'first_time_review_has_been_requested',
  GOOGLE_ANALYTICS = 'google_analytics',
  HAS_SEEN_BIRTHDAY_NOTIFICATION_CARD = 'has_seen_birthday_notification_card',
  HAS_SEEN_ELIGIBLE_CARD = 'has_seen_eligible_card',
  HAS_SEEN_TUTORIALS = 'has_seen_tutorials',
  KEYCHAIN = 'keychain',
  PHONE_VALIDATION_CODE_ASKED_AT = 'phone_validation_code_asked_at',
  RE_CAPTCHA = 're_captcha',
  REACT_NAVIGATION_PERSISTENCE = 'react_navigation_persistence',
  SENTRY = 'sentry',
  TIMES_REVIEW_HAS_BEEN_REQUESTED = 'times_review_has_been_requested',
  TRAFFIC_CAMPAIGN = 'traffic_campaign',
  TRAFFIC_MEDIUM = 'traffic_medium',
  TRAFFIC_SOURCE = 'traffic_source',
  UBBLE = 'ubble',
}

export enum CookieCategoriesEnum {
  customization = 'customization',
  performance = 'performance',
  marketing = 'marketing',
  essential = 'essential',
}

export enum CookiesSteps {
  COOKIES_CONSENT = 0,
  COOKIES_SETTINGS = 1,
}

export enum ConsentState {
  LOADING,
  UNKNOWN,
  HAS_CONSENT,
}
