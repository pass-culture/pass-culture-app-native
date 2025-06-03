useSimilarOffersQuery
 When success API response
- should call Algolia hook with category included
- should call Algolia hook with category excluded
- should call similar offers API when offer id provided and user share his position
- should call similar offers API when offer id provided and user not share his position
- should not call similar offers API when offer id provided, user share his position and shouldFetch is false


 When error API response
- should return empty params and undefined similar offers when fetch similar offers call fails


 useSimilarOffersQuery
- should capture an exception when fetch call fails
- should not call API reco when connection is disabled


 should return an empty array
- when categoryIncluded and categoryExcluded not defined
- when categoryExcluded defined but not searchGroups


 getCategories
- should return an array with category of categoryIncluded parameter when defined
- should return an array with all categories except none category and categoryExcluded parameter when it is defined

