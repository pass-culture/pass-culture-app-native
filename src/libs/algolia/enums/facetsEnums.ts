// Taken from https://www.algolia.com/apps/E2IKXJ325N/explorer/configuration/PRODUCTION/facets
export enum FACETS_ENUM {
  OBJECT_ID = 'objectID',
  OFFER_IS_DIGITAL = 'offer.isDigital',
  OFFER_IS_DUO = 'offer.isDuo',
  OFFER_IS_EVENT = 'offer.isEvent',
  OFFER_IS_EDUCATIONAL = 'offer.isEducational',
  OFFER_IS_THING = 'offer.isThing',
  OFFER_SEARCH_GROUP_NAME = 'offer.searchGroupNamev2',
  OFFER_SUB_CATEGORY = 'offer.subcategoryId',
  OFFER_NATIVE_CATEGORY = 'offer.nativeCategoryId',
  OFFER_BOOK_TYPE = 'offer.bookMacroSection',
  OFFER_MOVIE_GENRES = 'offer.movieGenres',
  OFFER_MUSIC_TYPE = 'offer.musicType',
  OFFER_SHOW_TYPE = 'offer.showType',
  OFFER_ID_FORBIDDEN_TO_UNDERAGE = 'offer.isForbiddenToUnderage',
  OFFER_TAGS = 'offer.tags',
  VENUE_ID = 'venue.id',
}

export enum NUMERIC_FILTERS_ENUM {
  OFFER_PRICES = 'offer.prices',
  OFFER_DATES = 'offer.dates',
  OFFER_TIMES = 'offer.times',
  OFFER_STOCKS_DATE_CREATED = 'offer.stocksDateCreated',
}

// Taken from https://www.algolia.com/apps/E2IKXJ325N/explorer/configuration/venues/facets
export enum VenuesFacets {
  tags = 'tags',
  venue_type = 'venue_type',
  has_at_least_one_bookable_offer = 'has_at_least_one_bookable_offer',
}
