// Taken from https://www.algolia.com/apps/E2IKXJ325N/explorer/configuration/PRODUCTION/facets
export enum FACETS_FILTERS_ENUM {
  ARTISTS_NAME = 'artists.name',
  OBJECT_ID = 'objectID',
  OFFER_ALLOCINE_ID = 'offer.allocineId',
  OFFER_BOOK_TYPE = 'offer.bookMacroSection',
  OFFER_EAN = 'offer.ean',
  OFFER_GTL_LEVEL = 'offer.gtl_levelXX',
  OFFER_GTL_CODE = 'offer.gtlCodeLevelXX',
  OFFER_ID_FORBIDDEN_TO_UNDERAGE = 'offer.isForbiddenToUnderage',
  OFFER_IS_DIGITAL = 'offer.isDigital',
  OFFER_IS_DUO = 'offer.isDuo',
  OFFER_IS_EDUCATIONAL = 'offer.isEducational',
  OFFER_IS_HEADLINE = 'offer.isHeadline',
  OFFER_MOVIE_GENRES = 'offer.movieGenres',
  OFFER_MUSIC_TYPE = 'offer.musicType',
  OFFER_NATIVE_CATEGORY = 'offer.nativeCategoryId',
  OFFER_SEARCH_GROUP_NAME = 'offer.searchGroupNamev2',
  OFFER_SHOW_TYPE = 'offer.showType',
  OFFER_SUB_CATEGORY = 'offer.subcategoryId',
  OFFER_TAGS = 'offer.tags',
  VENUE_ID = 'venue.id',
  VENUE_AUDIO_DISABILITY_COMPLIANT = 'venue.isAudioDisabilityCompliant',
  VENUE_MENTAL_DISABILITY_COMPLIANT = 'venue.isMentalDisabilityCompliant',
  VENUE_MOTOR_DISABILITY_COMPLIANT = 'venue.isMotorDisabilityCompliant',
  VENUE_VISUAL_DISABILITY_COMPLIANT = 'venue.isVisualDisabilityCompliant',
}

export enum NUMERIC_FILTERS_ENUM {
  OFFER_PRICES = 'offer.prices',
  OFFER_DATES = 'offer.dates',
  OFFER_TIMES = 'offer.times',
  OFFER_LAST_30_DAYS_BOOKINGS = 'offer.last30DaysBookings',
  OFFER_LIKES = 'offer.likes',
  OFFER_CHRONICLES_COUNT = 'offer.chroniclesCount',
}

// Taken from https://www.algolia.com/apps/E2IKXJ325N/explorer/configuration/venues/facets
export enum VENUES_FACETS_ENUM {
  TAGS = 'tags',
  ACTIVITY = 'activity',
  HAS_AT_LEAST_ONE_BOOKABLE_OFFER = 'has_at_least_one_bookable_offer',
  VENUE_AUDIO_DISABILITY_COMPLIANT = 'audio_disability',
  VENUE_MENTAL_DISABILITY_COMPLIANT = 'mental_disability',
  VENUE_MOTOR_DISABILITY_COMPLIANT = 'motor_disability',
  VENUE_VISUAL_DISABILITY_COMPLIANT = 'visual_disability',
  VENUE_IS_OPEN_TO_PUBLIC = 'is_open_to_public',
}
