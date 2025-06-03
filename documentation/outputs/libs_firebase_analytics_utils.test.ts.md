utils
 should build parameters for PerformSearch log
- when date filter is null
- with date filter
- with location filter
- when user press an autocomplete suggestion
- with max price filter
- with min price filter
- with an empty array of category filter
- with a category filter
- with an empty array of genre/types filter
- with a genre/types filter
- with duo offer filter
- with free offer filter
- with an empty array of native category filter
- with a native category filter
- with an empty query
- with a query
- when time range is null
- with time range filter
- when user press an history item


 should build parameters for ModuleDisplayedOnHomepage log
- should return an empty object when no offers or venues are provided
- should build module state for offers when only offers are provided
- should build module state for venues when only venues are provided
- should build module state for both offers and venues when both are provided
- should handle empty arrays correctly
- should handle undefined arrays correctly


 buildLocationFilterParam
- should return all location filter param in a string when type is EVERYWHERE
- should return all location filter param in a string when type is AROUND_ME
- should return location type and the name of the venue in a string when type is VENUE
- should return location type and the truncated name of the venue in a string when type is VENUE
- should return location type and the name of the place in a string when type is PLACE
- should return location type and the truncated name of the place in a string when type is PLACE


 [Analytics utils]
- event should not be close to bottom
- event should be close to bottom

