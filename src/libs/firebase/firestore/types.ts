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
  ENABLE_AI_FAKE_DOOR = 'enableAIFakeDoor',
  ENABLE_BONIFICATION = 'enableBonification',
  ENABLE_CHATBOT = 'enableChatbot',
  ENABLE_HIDE_TICKET = 'enableHideTicket',
  ENABLE_MANDATORY_UPDATE_PERSONAL_DATA = 'enableMandatoryUpdatePersonalData',
  ENABLE_PRO_REVIEWS_VENUE_AB_TESTING = 'enableProReviewsVenueABTesting',
  ENABLE_PROFILE_V2 = 'enableProfileV2',
  ENABLE_SEE_ALL_PLAYLIST = 'enableSeeAllPlaylist',
  ENABLE_REPLICA_ALGOLIA_INDEX = 'enableReplicaAlgoliaIndex',
  ENABLE_VENUES_FROM_OFFER_INDEX = 'enableVenuesFromOfferIndex',
  SHOW_REMOTE_GENERIC_BANNER = 'showRemoteBanner',
  SHOW_TECHNICAL_PROBLEM_BANNER = 'showTechnicalProblemBanner',
  WIP_ARTIST_PAGE = 'wipArtistPage',
  WIP_ARTIST_PAGE_IN_SEARCH = 'wipArtistPageInSearch',
  WIP_ARTISTS_SUGGESTIONS_IN_SEARCH = 'wipArtistsSuggestionsInSearch',
  WIP_DISABLE_STORE_REVIEW = 'wipDisabledStoreReview',
  WIP_ENABLE_APPLE_SSO = 'wipEnableAppleSSO',
  WIP_ENABLE_GRID_LIST = 'wipEnableGridList',
  WIP_ENABLE_VENUE_CALENDAR = 'wipEnableVenueCalendar',
  WIP_ENABLE_VOLUNTEER = 'wipEnableVolunteer',
  WIP_ENABLE_VOLUNTEER_FEEDBACK = 'wipEnableVolunteerFeedback',
  WIP_ENABLE_VOLUNTEER_NEW_TAG = 'wipEnableVolunteerNewTag',
  WIP_FLING_BOTTOM_SHEET_NAVIGATE_TO_VENUE = 'wipFlingBottomSheetNavigateToVenue',
  WIP_NEW_BOOKING_PAGE = 'wipNewBookingPage',
  WIP_NEW_BOOKINGS_ENDED_ONGOING = 'wipNewBookingsEndedOngoing',
  WIP_NEW_SEARCH_RESULTS_PAGE = 'wipNewSearchResultsPage',
  WIP_OFFER_CHRONICLE_SECTION = 'wipOfferChronicleSection',
  WIP_OFFER_MULTI_ARTISTS = 'wipOfferMultiArtists',
  WIP_OFFER_REFACTO = 'wipOfferRefacto',
  WIP_OFFER_VIDEO_SECTION = 'wipOfferVideoSection',
  WIP_PRO_REVIEWS_NEW_TAG = 'wipProReviewsNewTag',
  WIP_PRO_REVIEWS_OFFER = 'wipProReviewsOffer',
  WIP_PRO_REVIEWS_PLAYLIST = 'wipProReviewsPlaylist',
  WIP_PRO_REVIEWS_VENUE = 'wipProReviewsVenue',
  WIP_SEARCH_IN_VENUE_PAGE = 'wipSearchInVenuePage',
  WIP_THEMATIC_SEARCH_CONCERTS_AND_FESTIVALS = 'wipThematicSearchConcertsAndFestivals',
  WIP_THEMATIC_SEARCH_THEATRE = 'wipThematicSearchTheatre',
  WIP_VENUE_ARTISTS_PLAYLIST = 'wipVenueArtistsPlaylist',
  WIP_VENUE_MAP = 'wipVenueMap',
  WIP_VENUE_MAP_IN_SEARCH = 'wipVenueMapInSearch',
}
