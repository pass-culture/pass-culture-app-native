// We don't use all the fields indexed. Simply retrieve the one we use.
// see SearchHit
export const offerAttributesToRetrieve = [
  'offer.artist',
  'offer.dates',
  'offer.isDigital',
  'offer.isDuo',
  'offer.isEducational',
  'offer.name',
  'offer.prices',
  'offer.releaseDate',
  'offer.subcategoryId',
  'offer.thumbUrl',
  'offer.bookFormat',
  'offer.bookingAllowedDatetime',
  'objectID',
  '_geoloc',
  'venue',
  'artists',
  'offer.likes',
  'offer.chroniclesCount',
  'offer.headlineCount',
  '_tags',
]
