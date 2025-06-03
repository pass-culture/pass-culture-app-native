fetchOffers
 underage
- should fetch with provided query and default underage filter
- should fetch with facetFilters parameter when one category is provided and when underage


 query
- should fetch with provided query
- should fetch without query parameter when no keyword is provided


 geolocation
- should fetch with geolocation coordinates when latitude and longitude are provided
- should not fetch with geolocation coordinates when latitude and longitude are not valid
- should fetch offers with geolocation coordinates, when latitude, longitude and radius are provided and search is around me
- should fetch offers with geolocation coordinates, when latitude, longitude are provided and search is everywhere without radius
- should fetch offers with geolocation coordinates, when latitude, longitude are provided and search is everywhere
- should fetch offers with geolocation coordinates, when latitude, longitude, search is around me, and radius equals zero
- should fetch offers with geolocation coordinates, when latitude, longitude, search is around me, and radius is null


 categories and subcategories
- should fetch with no facetFilters parameter when no category is provided
- should fetch with facetFilters parameter when one category is provided
- should fetch with facetFilters parameter when multiple categories are provided
- should fetch with facetFilters parameter when one subcategory is provided
- should fetch with facetFilters parameter when multiple subcategory is provided
- should fetch with facetFilters parameter when one native category is provided
- should fetch with facetFilters parameter when multiple native category is provided
- should fetch with facetFilters parameter when one movieGenre is provided
- should fetch with facetFilters parameter when one bookMacroSection is provided
- should fetch with facetFilters parameter when one showType is provided
- should fetch with facetFilters parameter when one musicType is provided
- should fetch with facetFilters parameter when unknown genre type is provided


 offer types
- should fetch with no facetFilters when no offer type is provided
- should fetch with facetFilters when offer is digital
- should fetch with no facetFilters when offer is not digital


 offer duo
- should fetch with no facetFilters when offer duo is false
- should fetch with facetFilters when offer duo is true


 offer price
- should fetch with no numericFilters when no price range is specified and offer is not free
- should fetch with numericFilters when offer is free even when priceRange is provided
- should fetch with numericFilters range when price range is provided and offer is not free
- should fetch with minimum price when it is provided
- should fetch with 0 when minimum price is not provided
- should fetch with maximum price when it is provided


 by date only
- should fetch with date filter when date and today option are provided
- should fetch with date filter when date and currentWeek option are provided
- should fetch with date filter when date and currentWeekEnd option are provided
- should fetch with date filter when date and picked option are provided


 by time only
- should fetch with time filter when timeRange is provided


 by date and time
- should fetch with date filter when timeRange, date and today option are provided
- should fetch with date filter when timeRange, date and currentWeek option are provided
- should fetch with date filter when timeRange, date and currentWeekEnd option are provided
- should fetch with date filter when timeRange, date and picked option are provided


 date


 multiple parameters
- should fetch with price and date numericFilters
- should fetch with price and time numericFilters
- should fetch with price, date and time numericFilters
- should fetch with all given search parameters
- should fetch duo offers for categories pratique & spectacle around me


 tags
- should fetch with no facetFilters parameter when no tags are provided
- should fetch with facetFilters parameter when tags are provided


 hitsPerPage
- should fetch with no hitsPerPage parameter when not provided
- should fetch with hitsPerPage when provided


 beginningDatetime & endingDatetime
- should fetch from the beginning datetime
- should fetch until the ending datetime
- should fetch from the beginning datetime to the ending datetime


 Index name param
- should fetch Algolia offers index when param not provided
- should fetch a specific Algolia index when param provided


 isFromOffer param
- should fetch with typoTolerance and distinct when isFromOffer param is true
- should not fetch with typoTolerance and distinct when isFromOffer is false


 allocineId is taken into account
- should fetch with allocineId


 fetchOffer
- should fetch with provided query and default page number
- should store Algolia query ID after fetching an offer

