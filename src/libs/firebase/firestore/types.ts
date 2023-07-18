export enum RemoteStoreCollections {
  APPLICATION_VERSIONS = 'applicationVersions',
  COOKIES_LAST_UPDATE = 'cookiesLastUpdate',
  FEATURE_FLAGS = 'featureFlags',
  MAINTENANCE = 'maintenance',
  UBBLE = 'ubble',
}

export enum RemoteStoreDocuments {
  COOKIES_LAST_UPDATE_BUILD_VERSION = 'buildVersion',
  COOKIES_LAST_UPDATE_DATE = 'lastUpdated',
  MAINTENANCE_IS_ON = 'maintenanceIsOn',
  MAINTENANCE_MESSAGE = 'message',
  MINIMAL_BUILD_NUMBER = 'minimalBuildNumber',
  UBBLE_ETA_MESSAGE = 'etaMessage',
}

export enum RemoteStoreFeatureFlags {
  FAV_LIST_FAKE_DOOR = 'favListFakeDoor',
  WIP_DISABLE_STORE_REVIEW = 'wipDisabledStoreReview',
  WIP_CHANGE_EMAIL = 'wipChangeEmail',
  WIP_ENABLE_MULTIVENUE_OFFER = 'wipEnableMultivenueOffer',
  WIP_ENABLE_TRUSTED_DEVICE = 'wipEnableTrustedDevice',
  WIP_ENABLE_NEW_EXCLUSIVITY_BLOCK = 'wipEnableNewExclusivityBlock',
  WIP_PRICES_BY_CATEGORIES = 'wipPricesByCategories',
  WIP_STEPPER_RETRY_UBBLE = 'wipStepperRetryUbble',
  WIP_ATTRIBUTES_CINEMA_OFFERS = 'wipAttributesCinemaOffers',
}
