categoriesHelpers
 Category
- should return true when all native categories of the category are online platform
- should return false when all native categories of the category are offline
- should return false when native categories of the category are online and offline platform
- should return false when native categories of the category are online, offline and online or offline platform


 Native category
- should return true when all pro subcategories of the native category are online platform
- should return false when all pro subcategories of the native category are offline
- should return false when pro subcategories of the native category are online and offline platform
- should return false when pro subcategories of the native category are offline and online or offline platform


 isOnlyOnline
- should return false when category and native category are undefined


 getNativeCategoryFromEnum
- should return undefined when subcategories API return undefined data
- should return undefined when native category id is undefined
- should return the native category from native category id


 should return an empty array
- when no data from backend
- without native category in parameter


 getSearchGroupsEnumArrayFromNativeCategoryEnum
- should return an array of categories id


 isNativeCategoryOfCategory
- should return false when no data from backend
- should return false when native category not associated to category
- should return true when native category associated to category


 should render categories view
- by default when no category selected
- when category selected is "Cartes jeunes" because it does not native categories


 should render native categories view
- when category that is not "Cartes jeunes" because the native category view includes "Tout" choice selected
- when a category that is not "Cartes jeunes" and a native category that it has not genre type selected


 should render genre type categories view
- when a category, a native category that it has genre type selected
- when a category, a native category, a genre type categories selected


 getDefaultFormView


 getFacetTypeFromGenreTypeKey
- should return OFFER_BOOK_TYPE for "BOOK"
- should return OFFER_MUSIC_TYPE for "MUSIC"
- should return OFFER_SHOW_TYPE for "SHOW"
- should return OFFER_MOVIE_GENRES for "MOVIE"


 getNbResultsFacetLabel
- should display "+10000" when the number of result facets is greater than 10000
- should display the exact number of result facets is less than 10000
- should display "0" when the number of result facets is equal to 0
- should return undefined when the number of result facets is undefined


 buildBookSearchPayloadValues
- should return search payload for a book native category level
- should return search payload for a book genre type level


 useSubcategoryIdsFromSearchGroup
- should return subcategories of one given searchGroup
- should return subcategories of several given searchGroups
- should return empty array when no searchgroup is provided
- should return empty array when useSubcategories returns no data


 sortCategoriesPredicate
- should sort following position ascending order
- should prioritize position over label
- should sort following label alphabetical ascending order if no positions
- should sort following labels if positions are equal


 categoriesHelpers
- should sort categories by alphabetical order
- should sort native subcategories by alphabetical order

