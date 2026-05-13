import { omit } from 'lodash'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CATEGORY_CRITERIA, NEW_CATEGORY_CRITERIA } from 'features/search/enums'

// The available categories are every category expect "None" or "Toutes les catégories"
export const availableCategories = omit(CATEGORY_CRITERIA, SearchGroupNameEnumv2.NONE)

export const newAvailableCategories = omit(NEW_CATEGORY_CRITERIA, SearchGroupNameEnumv2.NONE)
