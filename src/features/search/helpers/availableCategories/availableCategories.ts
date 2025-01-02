import omit from 'lodash/omit'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CATEGORY_APPEARANCE } from 'features/search/enums'

// The available categories are every category expect "None" or "Toutes les catégories"
export const availableCategories = omit(
  CATEGORY_APPEARANCE,
  SearchGroupNameEnumv2.NONE,
  SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
  SearchGroupNameEnumv2.INSTRUMENTS,
  SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE
)
