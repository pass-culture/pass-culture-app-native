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
  WIP_CINEMA_OFFER_VENUE_BLOCK = 'wipCinemaOfferVenueBlock',
  WIP_DISABLE_STORE_REVIEW = 'wipDisabledStoreReview',
  WIP_DISPLAY_SEARCH_NB_FACET_RESULTS = 'wipDisplaySearchNbFacetResults',
  WIP_ENABLE_APP_LOCATION = 'wipEnableAppLocation',
  WIP_ENABLE_EMAIL_VALIDATION_RESEND = 'wipEnableEmailValidationResend',
  WIP_ENABLE_GOOGLE_SSO = 'wipEnableGoogleSSO',
  WIP_ENABLE_GTL_PLAYLISTS_IN_BOOKSTORE_VENUES = 'wipEnableGTLPlaylistsInBookstoreVenues',
  WIP_NEW_VENUE_PAGE = 'wipNewVenuePage',
  WIP_OFFER_V2 = 'wipOfferV2',
  WIP_SAME_ARTIST_PLAYLIST = 'wipSameArtistPlaylist',
  WIP_STEPPER_RETRY_UBBLE = 'wipStepperRetryUbble',
  WIP_NEW_MAPPING_BOOKS = 'wipNewMappingBooks',
  WIP_VENUE_MAP = 'wipVenueMap',
  WIP_VENUE_MAP_WITHOUT_PREVIEW = 'wipVenueMapWithoutPreview',
}
