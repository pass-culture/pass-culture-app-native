export const FIRESTORE_ROOT_COLLECTION = 'root'

export enum RemoteStoreDocuments {
  APPLICATION_VERSIONS = 'applicationVersions',
  COOKIES_LAST_UPDATE = 'cookiesLastUpdate',
  FEATURE_FLAGS = 'featureFlags',
  MAINTENANCE = 'maintenance',
  UBBLE = 'ubble',
}

export enum RemoteStoreMaintenance {
  MAINTENANCE_IS_ON = 'maintenanceIsOn',
  MAINTENANCE_MESSAGE = 'message',
}

export enum RemoteStoreCookies {
  COOKIES_LAST_UPDATE_BUILD_VERSION = 'buildVersion',
  COOKIES_LAST_UPDATE_DATE = 'lastUpdated',
}

export enum RemoteStoreAppVersion {
  MINIMAL_BUILD_NUMBER = 'minimalBuildNumber',
}

export enum RemoteStoreUbble {
  UBBLE_ETA_MESSAGE = 'etaMessage',
}

export enum MAINTENANCE {
  UNKNOWN = 'UNKNOWN',
  OFF = 'OFF',
  ON = 'ON',
}

export type Maintenance =
  | {
      status: MAINTENANCE.UNKNOWN
      message: undefined
    }
  | {
      status: MAINTENANCE.OFF
      message: undefined
    }
  | {
      status: MAINTENANCE.ON
      message: string
    }

export enum RemoteStoreFeatureFlags {
  DISABLE_ACTIVATION = 'disableActivation',
  ENABLE_ACHIEVEMENTS = 'enableAchievements',
  ENABLE_CULTURAL_SURVEY_MANDATORY = 'enableCulturalSurveyMandatory',
  ENABLE_HIDE_TICKET = 'enableHideTicket',
  ENABLE_PACIFIC_FRANC_CURRENCY = 'enablePacificFrancCurrency',
  ENABLE_PASS_FOR_ALL = 'enablePassForAll',
  ENABLE_REPLICA_ALGOLIA_INDEX = 'enableReplicaAlgoliaIndex',
  SHOW_REMOTE_GENERIC_BANNER = 'showRemoteBanner',
  TARGET_XP_CINE_FROM_OFFER = 'targetXpCineFromOffer',
  WIP_APP_V2_BUSINESS_BLOCK = 'wipAppV2BusinessBlock',
  WIP_APP_V2_CATEGORY_BLOCK = 'wipAppV2CategoryBlock',
  WIP_APP_V2_MULTI_VIDEO_MODULE = 'wipAppV2MultiVideoModule',
  WIP_APP_V2_THEMATIC_HOME_HEADER = 'wipAppV2ThematicHomeHeader',
  WIP_APP_V2_VENUE_LIST = 'wipAppV2VenueList',
  WIP_APP_V2_VENUE_MAP_BLOCK = 'wipAppV2VenueMapBlock',
  WIP_APP_V2_VIDEO_9_16 = 'wipAppV2Video9:16',
  WIP_ARTIST_PAGE = 'wipArtistPage',
  WIP_BOOKING_IMPROVE = 'wipBookingImprove',
  WIP_DISABLE_STORE_REVIEW = 'wipDisabledStoreReview',
  WIP_DISPLAY_SEARCH_NB_FACET_RESULTS = 'wipDisplaySearchNbFacetResults',
  WIP_ENABLE_ACCES_LIBRE = 'wipEnableAccesLibre',
  WIP_ENABLE_DYNAMIC_OPENING_HOURS = 'wipEnableDynamicOpeningHours',
  WIP_ENABLE_GOOGLE_SSO = 'wipEnableGoogleSSO',
  WIP_FLING_BOTTOM_SHEET_NAVIGATE_TO_VENUE = 'wipFlingBottomSheetNavigateToVenue',
  WIP_IS_OPEN_TO_PUBLIC = 'wipIsOpenToPublic',
  WIP_NEW_BOOKING_PAGE = 'wipNewBookingPage',
  WIP_NEW_HOME_MODULE_SIZES = 'wipNewHomeModuleSizes',
  WIP_OFFER_CHRONICLE_SECTION = 'wipOfferChronicleSection',
  WIP_OFFERS_IN_BOTTOM_SHEET = 'wipOffersInBottomSheet',
  WIP_REACTION_FEATURE = 'wipReactionFeature',
  WIP_THEMATIC_SEARCH_CONCERTS_AND_FESTIVALS = 'wipThematicSearchConcertsAndFestivals',
  WIP_THEMATIC_SEARCH_THEATRE = 'wipThematicSearchTheatre',
  WIP_VENUE_ARTISTS_PLAYLIST = 'wipVenueArtistsPlaylist',
  WIP_VENUE_HEADLINE_OFFER = 'wipVenueHeadlineOffer',
  WIP_VENUE_MAP = 'wipVenueMap',
  WIP_VENUE_MAP_HIDDEN_POI = 'wipVenueMapHiddenPOI',
  WIP_VENUE_MAP_IN_SEARCH = 'wipVenueMapInSearch',
  WIP_VENUE_MAP_PIN_V2 = 'wipVenueMapPinV2',
}
