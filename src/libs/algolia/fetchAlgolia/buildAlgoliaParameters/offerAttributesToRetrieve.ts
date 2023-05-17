// We don't use all the fields indexed. Simply retrieve the one we use.
// see SearchHit
export const offerAttributesToRetrieve = [
  'offer.dates',
  'offer.isDigital',
  'offer.isDuo',
  'offer.isEducational',
  'offer.name',
  'offer.prices',
  'offer.subcategoryId',
  'offer.thumbUrl',
  'objectID',
  '_geoloc',
  'venue',
]
