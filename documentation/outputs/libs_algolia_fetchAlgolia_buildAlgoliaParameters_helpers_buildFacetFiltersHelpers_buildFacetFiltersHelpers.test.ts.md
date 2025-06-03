buildFacetFiltersHelpers
 buildOfferCategoriesPredicate
- should return an offer categories predicate formatted for Algolia API


 buildOfferSubcategoriesPredicate
- should return an offer subcategories predicate formatted for Algolia API


 buildOfferNativeCategoriesPredicate
- should return an offer native categories predicate formatted for Algolia API
- should return an LIVRES_PAPIERS offer native categories predicate formatted for Algolia API with BookEnum


 buildOfferGenreTypesPredicate
- should return an offer genre types predicate with an empty string when no API correspondence
- should return a movie offer genre types predicate formatted for Algolia API
- should return a book offer genre types predicate formatted for Algolia API
- should return a music offer genre types predicate formatted for Algolia API
- should return a show offer genre types predicate formatted for Algolia API


 buildObjectIdsPredicate
- should return an object ids predicate formatted for Algolia API
- should catch an error Sentry when object ids param not correctly passed and return an empty array


 buildEanPredicate
- should return an ean predicate formatted for Algolia API


 buildOfferIsDuoPredicate
- should return an offer is duo predicate formatted for Algolia API when offerIsDuo param is true
- should return undefined when offerIsDuo param is false


 buildTagsPredicate
- should return undefined when no tags associated
- should return a tags predicate formatted for Algolia API


 buildOfferGtlsPredicate
- should return empty array when no gtls associated
- should return a gtls predicate formatted for Algolia API


 buildAllocineIdPredicate
- should return an allocine predicate formatted for Algolia API


 buildAccessibiltyFiltersPredicate
- should return an accessibility filters predicate formatted for Algolia API
- should return an empty array when no accessibility filters associated
- should return all accessibility filters predicate formatted for Algolia API

