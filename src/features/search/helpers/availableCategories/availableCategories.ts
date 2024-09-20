import omit from 'lodash/omit'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'

// The available categories are every category expect "None" or "Toutes les catégories" or to-be-removed categories
export const availableCategories = omit(
  CATEGORY_CRITERIA,
  SearchGroupNameEnumv2.NONE,
  SearchGroupNameEnumv2.FILMS_SERIES_CINEMA
)

export const excludedCategoriesByName = [
  'DEPRECIEE',
  'FILMS_SERIES_CINEMA',
  'JEUX_PHYSIQUES',
  'NO_NATIVE_CATEGORY',
  'NONE',
]
