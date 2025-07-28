export const FIRESTORE_ROOT_COLLECTION = 'root'

export enum RemoteStoreDocuments {
  APPLICATION_VERSIONS = 'applicationVersions',
  COOKIES_LAST_UPDATE = 'cookiesLastUpdate',
  FEATURE_FLAGS = 'featureFlags',
  MAINTENANCE = 'maintenance',
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
  ENABLE_BOOKING_FREE_OFFER_15_16 = 'enableBookingFreeOfferFifteenSixteen',
  ENABLE_CULTURAL_SURVEY_MANDATORY = 'enableCulturalSurveyMandatory',
  ENABLE_DEBUG_SECTION = 'enableDebugSection',
  ENABLE_HIDE_TICKET = 'enableHideTicket',
  ENABLE_PACIFIC_FRANC_CURRENCY = 'enablePacificFrancCurrency',
  ENABLE_PASS_FOR_ALL = 'enablePassForAll',
  ENABLE_REPLICA_ALGOLIA_INDEX = 'enableReplicaAlgoliaIndex',
  SHOW_REMOTE_GENERIC_BANNER = 'showRemoteBanner',
  TARGET_XP_CINE_FROM_OFFER = 'targetXpCineFromOffer',
  WIP_ARTIST_PAGE = 'wipArtistPage',
  WIP_ARTIST_PAGE_IN_SEARCH = 'wipArtistPageInSearch',
  WIP_DISABLE_STORE_REVIEW = 'wipDisabledStoreReview',
  WIP_DISPLAY_SEARCH_NB_FACET_RESULTS = 'wipDisplaySearchNbFacetResults',
  WIP_ENABLE_ACCES_LIBRE = 'wipEnableAccesLibre',
  WIP_ENABLE_DARK_MODE = 'wipEnableDarkMode',
  WIP_ENABLE_GOOGLE_SSO = 'wipEnableGoogleSSO',
  WIP_ENABLE_GRID_LIST = 'wipEnableGridList',
  WIP_ENABLE_LOAN_FAKEDOOR = 'wipEnableLoanFakedoor',
  WIP_FLING_BOTTOM_SHEET_NAVIGATE_TO_VENUE = 'wipFlingBottomSheetNavigateToVenue',
  WIP_IS_OPEN_TO_PUBLIC = 'wipIsOpenToPublic',
  WIP_NEW_BOOKING_PAGE = 'wipNewBookingPage',
  WIP_OFFER_CHRONICLE_SECTION = 'wipOfferChronicleSection',
  WIP_OFFER_VIDEO_SECTION = 'wipOfferVideoSection',
  WIP_OFFERS_IN_BOTTOM_SHEET = 'wipOffersInBottomSheet',
  WIP_REACTION_FEATURE = 'wipReactionFeature',
  WIP_THEMATIC_SEARCH_CONCERTS_AND_FESTIVALS = 'wipThematicSearchConcertsAndFestivals',
  WIP_THEMATIC_SEARCH_THEATRE = 'wipThematicSearchTheatre',
  WIP_TIME_FILTER_V2 = 'wipTimeFilterV2',
  WIP_VENUE_ARTISTS_PLAYLIST = 'wipVenueArtistsPlaylist',
  WIP_VENUE_HEADLINE_OFFER = 'wipVenueHeadlineOffer',
  WIP_VENUE_MAP = 'wipVenueMap',
  WIP_VENUE_MAP_IN_SEARCH = 'wipVenueMapInSearch',
}
