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
  DARK_MODE_GTM = 'darkModeGTM',
  DISABLE_ACHIEVEMENTS_SUCCESS_MODAL = 'disableAchievementsSuccessModal',
  DISABLE_ACTIVATION = 'disableActivation',
  ENABLE_BONIFICATION = 'enableBonification',
  ENABLE_BOOKING_FREE_OFFER_15_16 = 'enableBookingFreeOfferFifteenSixteen',
  ENABLE_CULTURAL_SURVEY_MANDATORY = 'enableCulturalSurveyMandatory',
  ENABLE_DEBUG_SECTION = 'enableDebugSection',
  ENABLE_HIDE_TICKET = 'enableHideTicket',
  ENABLE_HOME_SATISFACTION_QUALTRICS = 'enableHomeSatisfactionQualtrics',
  ENABLE_MANDATORY_UPDATE_PERSONAL_DATA = 'enableMandatoryUpdatePersonalData',
  ENABLE_PACIFIC_FRANC_CURRENCY = 'enablePacificFrancCurrency',
  ENABLE_PASS_FOR_ALL = 'enablePassForAll',
  ENABLE_PROFILE_V2 = 'enableProfileV2',
  ENABLE_REPLICA_ALGOLIA_INDEX = 'enableReplicaAlgoliaIndex',
  ENABLE_VENUES_FROM_OFFER_INDEX = 'enableVenuesFromOfferIndex',
  SHOW_REMOTE_GENERIC_BANNER = 'showRemoteBanner',
  SHOW_TECHNICAL_PROBLEM_BANNER = 'showTechnicalProblemBanner',
  WIP_ARTIST_PAGE = 'wipArtistPage',
  WIP_ARTIST_PAGE_IN_SEARCH = 'wipArtistPageInSearch',
  WIP_ARTISTS_SUGGESTIONS_IN_SEARCH = 'wipArtistsSuggestionsInSearch',
  WIP_DISABLE_STORE_REVIEW = 'wipDisabledStoreReview',
  WIP_DISPLAY_SEARCH_NB_FACET_RESULTS = 'wipDisplaySearchNbFacetResults',
  WIP_ENABLE_ACCES_LIBRE = 'wipEnableAccesLibre',
  WIP_ENABLE_DARK_MODE = 'wipEnableDarkMode',
  WIP_ENABLE_GOOGLE_SSO = 'wipEnableGoogleSSO',
  WIP_ENABLE_GRID_LIST = 'wipEnableGridList',
  WIP_ENABLE_VENUE_CALENDAR = 'wipEnableVenueCalendar',
  WIP_FLING_BOTTOM_SHEET_NAVIGATE_TO_VENUE = 'wipFlingBottomSheetNavigateToVenue',
  WIP_IS_OPEN_TO_PUBLIC = 'wipIsOpenToPublic',
  WIP_NEW_BOOKING_PAGE = 'wipNewBookingPage',
  WIP_NEW_BOOKINGS_ENDED_ONGOING = 'wipNewBookingsEndedOngoing',
  WIP_OFFER_CHRONICLE_SECTION = 'wipOfferChronicleSection',
  WIP_OFFER_MULTI_ARTISTS = 'wipOfferMultiArtists',
  WIP_OFFER_REFACTO = 'wipOfferRefacto',
  WIP_OFFER_VIDEO_SECTION = 'wipOfferVideoSection',
  WIP_OFFERS_IN_BOTTOM_SHEET = 'wipOffersInBottomSheet',
  WIP_PRO_RECOMMENDATIONS = 'wipProRecommendations',
  WIP_REACTION_FEATURE = 'wipReactionFeature',
  WIP_SEARCH_IN_VENUE_PAGE = 'wipSearchInVenuePage',
  WIP_THEMATIC_SEARCH_CONCERTS_AND_FESTIVALS = 'wipThematicSearchConcertsAndFestivals',
  WIP_THEMATIC_SEARCH_THEATRE = 'wipThematicSearchTheatre',
  WIP_TIME_FILTER_V2 = 'wipTimeFilterV2',
  WIP_VENUE_ARTISTS_PLAYLIST = 'wipVenueArtistsPlaylist',
  WIP_VENUE_HEADLINE_OFFER = 'wipVenueHeadlineOffer',
  WIP_VENUE_MAP = 'wipVenueMap',
  WIP_VENUE_MAP_IN_SEARCH = 'wipVenueMapInSearch',
  WIP_VIDEO_COOKIES_CONSENT = 'wipVideoCookiesConsent',
}
