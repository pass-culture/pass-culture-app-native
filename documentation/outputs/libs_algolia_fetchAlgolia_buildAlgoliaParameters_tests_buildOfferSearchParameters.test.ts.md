buildOfferSearchParameters
 buildOfferSearchParameters
- should return expected offer search parameters to build Algolia API call
- should return offer search parameters without location params when the offer is a fully digital category
- should return parameters with date filter when date is specified
- should return parameters with offer category filter when offer category is specified
- should return parameters with minimum price filter when minPrice is specified
- should return parameters with geolocation filter when userLocation is specified

