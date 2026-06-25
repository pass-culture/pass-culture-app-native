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
  DISABLE_HANDICAP_BONIFICATION_BUTTON = 'disableHandicapBonificationButton',
  DISABLE_QF_BONIFICATION_BUTTON = 'disableQFBonificationButton',
  ENABLE_BONIFICATION = 'enableBonification',
  ENABLE_CHATBOT = 'enableChatbot',
  ENABLE_HANDICAP_BONIFICATION = 'enableHandicapBonification',
  ENABLE_HIDE_TICKET = 'enableHideTicket',
  ENABLE_MANDATORY_UPDATE_PERSONAL_DATA = 'enableMandatoryUpdatePersonalData',
  ENABLE_PRO_REVIEWS_VENUE_AB_TESTING = 'enableProReviewsVenueABTesting',
  ENABLE_QUALTRICS_SURVEY = 'enableQualtricsSurvey',
  ENABLE_REPLICA_ALGOLIA_INDEX = 'enableReplicaAlgoliaIndex',
  ENABLE_SEE_ALL_PLAYLIST = 'enableSeeAllPlaylist',
  ENABLE_VENUES_FROM_OFFER_INDEX = 'enableVenuesFromOfferIndex',
  SHOW_REMOTE_GENERIC_BANNER = 'showRemoteBanner',
  SHOW_TECHNICAL_PROBLEM_BANNER = 'showTechnicalProblemBanner',
  WIP_ARTIST_CATEGORY_PLAYLISTS = 'wipArtistCategoryPlaylists',
  WIP_ARTIST_FAKE_DOOR = 'wipArtistFakeDoor',
  WIP_ARTIST_RECOMMENDATION_PLAYLIST = 'wipArtistRecommendationPlaylist',
  WIP_ARTIST_SECTION_REFACTO = 'wipArtistSectionRefacto',
  WIP_ARTISTS_SUGGESTIONS_IN_SEARCH = 'wipArtistsSuggestionsInSearch',
  WIP_DISABLE_STORE_REVIEW = 'wipDisabledStoreReview',
  WIP_ENABLE_APPLE_SSO = 'wipEnableAppleSSO',
  WIP_ENABLE_GRID_LIST = 'wipEnableGridList',
  WIP_ENABLE_SIMILAR_ARTISTS = 'wipEnableSimilarArtists',
  WIP_ENABLE_VENUE_CALENDAR = 'wipEnableVenueCalendar',
  WIP_ENABLE_VOLUNTEER = 'wipEnableVolunteer',
  WIP_ENABLE_VOLUNTEER_FEEDBACK = 'wipEnableVolunteerFeedback',
  WIP_NEW_BOOKINGS_ENDED_ONGOING = 'wipNewBookingsEndedOngoing',
  WIP_NEW_CATEGORY_BLOCKS = 'wipNewCategoryBlocks',
  WIP_NEW_CATEGORY_BLOCKS_HOME = 'wipNewCategoryBlocksHome',
  WIP_NEW_SEARCH_RESULTS_PAGE = 'wipNewSearchResultsPage',
  WIP_OFFER_CHRONICLE_SECTION = 'wipOfferChronicleSection',
  WIP_OFFER_REFACTO = 'wipOfferRefacto',
  WIP_PHONE_NUMBER_IN_PROFILE_STEPPER = 'wipPhoneNumberInProfileStepper',
  WIP_PRO_REVIEWS_OFFER = 'wipProReviewsOffer',
  WIP_PRO_REVIEWS_PLAYLIST = 'wipProReviewsPlaylist',
  WIP_PRO_REVIEWS_VENUE = 'wipProReviewsVenue',
  WIP_REVIEW_TRIGGER_BOOKING = 'wipReviewTriggerBooking',
  WIP_REVIEW_TRIGGER_CREDIT = 'wipReviewTriggerCredit',
  WIP_REVIEW_TRIGGER_LIKE = 'wipReviewTriggerLike',
  WIP_REVIEW_TRIGGER_OFFERS = 'wipReviewTriggerOffers',
  WIP_SCENE_CLUB = 'wipSceneClub',
  WIP_SEARCH_IN_VENUE_PAGE = 'wipSearchInVenuePage',
  WIP_THEMATIC_SEARCH_CONCERTS_AND_FESTIVALS = 'wipThematicSearchConcertsAndFestivals',
  WIP_THEMATIC_SEARCH_THEATRE = 'wipThematicSearchTheatre',
  WIP_VENUE_MAP = 'wipVenueMap',
  WIP_VENUE_MAP_IN_SEARCH = 'wipVenueMapInSearch',
}
